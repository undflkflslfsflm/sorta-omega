param(
  [Parameter(Mandatory = $true)][string]$VaultId,
  [Parameter(Mandatory = $true)][string]$AppContainer,
  [Parameter(Mandatory = $true)][string]$InSchoolOrigin,
  [string]$RepositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path,
  [string]$ProfilePath = (Join-Path $env:LOCALAPPDATA 'SortaOmega\BrowserBridge\EdgeUserData')
)

$ErrorActionPreference = 'Stop'
$statusDirectory = Split-Path -Parent $ProfilePath
New-Item -ItemType Directory -Path $statusDirectory -Force | Out-Null
$statusLog = Join-Path $statusDirectory 'sync-status.jsonl'
try {
if ($VaultId -notmatch '^[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$') { throw 'A vault UUID is required.' }
if ($AppContainer -notmatch '^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$') { throw 'A literal Docker app container name is required.' }
$origin = [Uri]$InSchoolOrigin
if ($origin.Scheme -ne 'https' -or -not $origin.Host.EndsWith('.inschool.visma.no') -or $origin.AbsolutePath -ne '/' -or $origin.Query -or $origin.Fragment) { throw 'A registered InSchool HTTPS origin is required.' }
$bridge = Join-Path $RepositoryRoot 'apps\browser-bridge\dist\cli.js'
$compiler = Join-Path $RepositoryRoot 'apps\browser-bridge\node_modules\.bin\tsc.cmd'
$bridgeProject = Join-Path $RepositoryRoot 'apps\browser-bridge\tsconfig.json'
if (-not (Test-Path -LiteralPath $compiler) -or -not (Test-Path -LiteralPath $bridgeProject)) { throw 'Install the bridge dependencies before syncing.' }
& $compiler -p $bridgeProject | Out-Null
if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $bridge)) { throw 'The school browser bridge could not be built.' }
$portFile = Join-Path $ProfilePath 'DevToolsActivePort'
function Test-SchoolEdgeReady {
  if (-not (Test-Path -LiteralPath $portFile)) { return $false }
  $portText = (Get-Content -LiteralPath $portFile -TotalCount 1).Trim()
  if ($portText -notmatch '^\d{4,5}$' -or [int]$portText -lt 1024 -or [int]$portText -gt 65535) { return $false }
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$portText/json/version" -TimeoutSec 2
    return [int]$response.StatusCode -eq 200
  } catch { return $false }
}

if (-not (Test-SchoolEdgeReady)) {
  $launcher = Join-Path $RepositoryRoot 'apps\browser-bridge\launch-edge-profile.ps1'
  if (-not (Test-Path -LiteralPath $launcher)) { throw 'The school Edge launcher is missing.' }
  & $launcher -InSchoolOrigin $origin.GetLeftPart([UriPartial]::Authority) | Out-Null
  for ($attempt = 0; $attempt -lt 10 -and -not (Test-SchoolEdgeReady); $attempt++) {
    Start-Sleep -Seconds 1
  }
  if (-not (Test-SchoolEdgeReady)) {
    throw 'The school Edge window could not be reopened. Use the Sorta Omega - Connect school accounts shortcut and leave the InSchool timetable tab open.'
  }
}

$spool = Join-Path $env:LOCALAPPDATA 'SortaOmega\BrowserBridge\spool'
New-Item -ItemType Directory -Path $spool -Force | Out-Null
$name = 'inschool-' + [Guid]::NewGuid().ToString('N') + '.json'
$artifact = Join-Path $spool $name
$containerArtifact = '/tmp/' + $name
$copied = $false
$attendanceName = 'inschool-' + [Guid]::NewGuid().ToString('N') + '.json'
$attendanceArtifact = Join-Path $spool $attendanceName
$containerAttendanceArtifact = '/tmp/' + $attendanceName
$attendanceCopied = $false
try {
  $bridgeOutput = @(& node $bridge --provider inschool --origin $origin.GetLeftPart([UriPartial]::Authority) --cdp-profile $ProfilePath --noninteractive true --output $artifact)
  $bridgeExitCode = $LASTEXITCODE
  if ($bridgeExitCode -ne 0) {
    $bridgeErrorCode = 'browser_bridge_failed'
    if ($bridgeOutput.Count -gt 0) {
      try { $bridgeErrorCode = ($bridgeOutput[-1] | ConvertFrom-Json).errorCode } catch { }
    }
    if ($bridgeErrorCode -notmatch '^[a-z0-9_]{1,100}$') { $bridgeErrorCode = 'browser_bridge_failed' }
    throw "The InSchool browser capture failed: $bridgeErrorCode"
  }
  $bridgeReport = $bridgeOutput[-1] | ConvertFrom-Json
  if ($bridgeReport.provider -ne 'inschool' -or $bridgeReport.itemCount -lt 1 -or $bridgeReport.uniqueLessonCount -lt 1) { throw 'The InSchool bridge returned an invalid capture report.' }
  & docker cp $artifact "${AppContainer}:$containerArtifact"
  if ($LASTEXITCODE -ne 0) { throw 'The snapshot could not be transferred to the app container.' }
  $copied = $true
  $importOutput = @(& docker exec $AppContainer node /app/apps/api/dist/import-school-snapshot.js --vault-id $VaultId --file $containerArtifact)
  if ($LASTEXITCODE -ne 0) { throw 'The InSchool snapshot was not applied.' }
  $importReport = $importOutput[-1] | ConvertFrom-Json
  if ($null -eq $importReport.counts.lesson) { throw 'The InSchool import returned no lesson counts.' }
  $lessonActions = $importReport.counts.lesson
  $accounted = [int]$lessonActions.created + [int]$lessonActions.updated + [int]$lessonActions.linked + [int]$lessonActions.unchanged + [int]$lessonActions.stale
  if ($accounted -ne [int]$bridgeReport.uniqueLessonCount) { throw 'The InSchool import did not account for every captured lesson.' }

  $attendanceOutput = @(& node $bridge --provider inschool-attendance --origin $origin.GetLeftPart([UriPartial]::Authority) --cdp-profile $ProfilePath --noninteractive true --base-snapshot $artifact --output $attendanceArtifact)
  if ($LASTEXITCODE -ne 0) {
    $attendanceErrorCode = 'browser_bridge_failed'
    if ($attendanceOutput.Count -gt 0) {
      try { $attendanceErrorCode = ($attendanceOutput[-1] | ConvertFrom-Json).errorCode } catch { }
    }
    if ($attendanceErrorCode -notmatch '^[a-z0-9_]{1,100}$') { $attendanceErrorCode = 'browser_bridge_failed' }
    throw "The InSchool attendance capture failed: $attendanceErrorCode"
  }
  $attendanceReport = $attendanceOutput[-1] | ConvertFrom-Json
  if ($attendanceReport.provider -ne 'inschool-attendance' -or -not $attendanceReport.coverage.complete -or $attendanceReport.coverage.importedRows -lt 1 -or $attendanceReport.coverage.importedRows -ne $attendanceReport.coverage.detailRows -or $attendanceReport.coverage.reportedRows -ne $attendanceReport.coverage.overviewRows) {
    $coverage = $attendanceReport.coverage
    throw "The InSchool attendance capture was incomplete (reported=$($coverage.reportedRows), overview=$($coverage.overviewRows), details=$($coverage.detailRows), mapped=$($coverage.importedRows), limitations=$(@($coverage.limitations).Count)); no attendance records were imported."
  }
  & docker cp $attendanceArtifact "${AppContainer}:$containerAttendanceArtifact"
  if ($LASTEXITCODE -ne 0) { throw 'The attendance snapshot could not be transferred to the app container.' }
  $attendanceCopied = $true
  $attendanceImportOutput = @(& docker exec $AppContainer node /app/apps/api/dist/import-school-snapshot.js --vault-id $VaultId --file $containerAttendanceArtifact)
  if ($LASTEXITCODE -ne 0) { throw 'The InSchool attendance snapshot was not applied.' }
  $attendanceImportReport = $attendanceImportOutput[-1] | ConvertFrom-Json
  $attendanceActions = $attendanceImportReport.counts.attendance
  if ($null -eq $attendanceActions) { throw 'The InSchool import returned no attendance counts.' }
  $attendanceAccounted = [int]$attendanceActions.created + [int]$attendanceActions.updated + [int]$attendanceActions.linked + [int]$attendanceActions.unchanged + [int]$attendanceActions.stale
  if ($attendanceAccounted -ne [int]$attendanceReport.coverage.importedRows) { throw 'The InSchool import did not account for every captured attendance record.' }
} finally {
  if ($copied) { & docker exec -u 0 $AppContainer rm $containerArtifact | Out-Null }
  if ($attendanceCopied) { & docker exec -u 0 $AppContainer rm $containerAttendanceArtifact | Out-Null }
  if (Test-Path -LiteralPath $artifact) { Remove-Item -LiteralPath $artifact -Force }
  if (Test-Path -LiteralPath $attendanceArtifact) { Remove-Item -LiteralPath $attendanceArtifact -Force }
}
[IO.File]::AppendAllText($statusLog, (([ordered]@{at=(Get-Date).ToUniversalTime().ToString('o');status='succeeded';visitedWeeks=$bridgeReport.visitedWeekCount;capturedLessons=$bridgeReport.uniqueLessonCount;created=$lessonActions.created;updated=$lessonActions.updated;linked=$lessonActions.linked;unchanged=$lessonActions.unchanged;stale=$lessonActions.stale;capturedAttendance=$attendanceReport.coverage.importedRows;attendanceLinkedLessons=$attendanceReport.coverage.linkedLessonRows;attendanceUnlinkedLessons=$attendanceReport.coverage.unlinkedLessonRows;attendanceCreated=$attendanceActions.created;attendanceUpdated=$attendanceActions.updated;attendanceLinked=$attendanceActions.linked;attendanceUnchanged=$attendanceActions.unchanged;attendanceStale=$attendanceActions.stale} | ConvertTo-Json -Compress) + "`n"))
} catch {
  $message = $_.Exception.Message
  if ($message.Length -gt 240) { $message = $message.Substring(0,240) }
  [IO.File]::AppendAllText($statusLog, (([ordered]@{at=(Get-Date).ToUniversalTime().ToString('o');status='failed';reason=$message} | ConvertTo-Json -Compress) + "`n"))
  throw
}
