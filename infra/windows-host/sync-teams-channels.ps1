param(
  [Parameter(Mandatory = $true)][string]$VaultId,
  [Parameter(Mandatory = $true)][string]$AppContainer,
  [string]$RepositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path,
  [string]$ProfilePath = (Join-Path $env:LOCALAPPDATA 'SortaOmega\BrowserBridge\EdgeUserData'),
  [string]$InSchoolOrigin = 'https://mailand.inschool.visma.no',
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
if ($VaultId -notmatch '^[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$') { throw 'A vault UUID is required.' }
if ($AppContainer -notmatch '^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$') { throw 'A literal Docker app container name is required.' }
$origin = [Uri]$InSchoolOrigin
if ($origin.Scheme -ne 'https' -or -not $origin.Host.EndsWith('.inschool.visma.no') -or $origin.AbsolutePath -ne '/' -or $origin.Query -or $origin.Fragment) { throw 'A registered InSchool HTTPS origin is required.' }
$statusDirectory = Split-Path -Parent $ProfilePath
New-Item -ItemType Directory -Path $statusDirectory -Force | Out-Null
$statusLog = Join-Path $statusDirectory 'teams-channels-sync-status.jsonl'

try {
  $bridge = Join-Path $RepositoryRoot 'apps\browser-bridge\dist\cli.js'
  $compiler = Join-Path $RepositoryRoot 'apps\browser-bridge\node_modules\.bin\tsc.cmd'
  $bridgeProject = Join-Path $RepositoryRoot 'apps\browser-bridge\tsconfig.json'
  if (-not (Test-Path -LiteralPath $compiler) -or -not (Test-Path -LiteralPath $bridgeProject)) { throw 'Install the browser bridge dependencies before syncing.' }
  & $compiler -p $bridgeProject | Out-Null
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $bridge)) { throw 'The Teams browser bridge could not be built.' }

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
    for ($attempt = 0; $attempt -lt 10 -and -not (Test-SchoolEdgeReady); $attempt++) { Start-Sleep -Seconds 1 }
    if (-not (Test-SchoolEdgeReady)) { throw 'The signed-in school Edge window could not be reopened.' }
  }

  $spool = Join-Path $env:LOCALAPPDATA 'SortaOmega\BrowserBridge\spool'
  New-Item -ItemType Directory -Path $spool -Force | Out-Null
  $name = 'teams-channels-' + [Guid]::NewGuid().ToString('N') + '.json'
  $artifact = Join-Path $spool $name
  $containerArtifact = '/tmp/' + $name
  $copied = $false
  try {
    $bridgeOutput = @(& node $bridge --provider teams-channels --cdp-profile $ProfilePath --noninteractive true --output $artifact)
    if ($LASTEXITCODE -ne 0) {
      $errorCode = 'browser_bridge_failed'
      if ($bridgeOutput.Count -gt 0) { try { $errorCode = ($bridgeOutput[-1] | ConvertFrom-Json).errorCode } catch { } }
      if ($errorCode -notmatch '^[a-z0-9_]{1,100}$') { $errorCode = 'browser_bridge_failed' }
      throw "The Teams class-post capture failed: $errorCode"
    }
    $bridgeReport = $bridgeOutput[-1] | ConvertFrom-Json
    if ($bridgeReport.provider -ne 'teams-channels' -or $bridgeReport.format -ne 'omega_notes_json_v1' -or $bridgeReport.itemCount -lt 1 -or $bridgeReport.itemCount -gt 500 -or [int]$bridgeReport.coverage.posts -ne [int]$bridgeReport.itemCount -or $null -eq $bridgeReport.coverage.replies -or [int]$bridgeReport.coverage.replies -lt 0 -or [int]$bridgeReport.coverage.replies -gt [int]$bridgeReport.itemCount -or [int]$bridgeReport.coverage.classes -lt 1 -or [int]$bridgeReport.coverage.channels -lt [int]$bridgeReport.coverage.classes -or [int]$bridgeReport.coverage.emptyPosts -lt 0) { throw 'The Teams bridge returned an invalid class-post capture report.' }
    if (Test-Path -LiteralPath $statusLog) {
      $previousSuccess = @(Get-Content -LiteralPath $statusLog -Encoding UTF8 | ForEach-Object {
        try { $_ | ConvertFrom-Json } catch { $null }
      } | Where-Object { $_ -and $_.status -eq 'succeeded' -and -not $_.dryRun } | Select-Object -Last 1)
      if ($previousSuccess.Count -eq 1 -and ([int]$bridgeReport.coverage.classes -lt [int]$previousSuccess[0].classes -or [int]$bridgeReport.itemCount -lt [int]$previousSuccess[0].captured -or ($null -ne $previousSuccess[0].channels -and [int]$bridgeReport.coverage.channels -lt [int]$previousSuccess[0].channels))) {
        throw 'The Teams class-post capture is smaller than the last complete import; no posts were imported. Inspect live source coverage before accepting removals.'
      }
    }
    $snapshot = Get-Content -LiteralPath $artifact -Raw | ConvertFrom-Json
    if (@($snapshot).Count -ne [int]$bridgeReport.itemCount) { throw 'The Teams class-post snapshot did not account for every captured post.' }
    & docker cp $artifact "${AppContainer}:$containerArtifact"
    if ($LASTEXITCODE -ne 0) { throw 'The Teams class-post snapshot could not be transferred to the app container.' }
    $copied = $true
    $importArgs = @('exec', $AppContainer, 'node', '/app/apps/api/dist/import-teams-channels.js', '--vault-id', $VaultId, '--file', $containerArtifact)
    if ($DryRun) { $importArgs += @('--dry-run', 'true') }
    $importOutput = @(& docker @importArgs)
    if ($LASTEXITCODE -ne 0) { throw 'The Teams class-post snapshot was not applied.' }
    $importReport = $importOutput[-1] | ConvertFrom-Json
    $actions = $importReport.counts
    if ($null -eq $actions -or [bool]$importReport.dryRun -ne [bool]$DryRun -or [int]$importReport.itemCount -ne [int]$bridgeReport.itemCount) { throw 'The Teams class-post import returned an invalid report.' }
    $accounted = [int]$actions.created + [int]$actions.updated + [int]$actions.unchanged
    if ($accounted -ne [int]$bridgeReport.itemCount) { throw 'The Teams class-post import did not account for every captured post.' }
  } finally {
    if ($copied) { & docker exec -u 0 $AppContainer rm $containerArtifact | Out-Null }
    if (Test-Path -LiteralPath $artifact) { Remove-Item -LiteralPath $artifact -Force }
  }
  $status = [ordered]@{at=(Get-Date).ToUniversalTime().ToString('o');status='succeeded';dryRun=[bool]$DryRun;classes=[int]$bridgeReport.coverage.classes;channels=[int]$bridgeReport.coverage.channels;replies=[int]$bridgeReport.coverage.replies;emptyPosts=[int]$bridgeReport.coverage.emptyPosts;captured=[int]$bridgeReport.itemCount;created=[int]$actions.created;updated=[int]$actions.updated;unchanged=[int]$actions.unchanged;coverageComplete=[bool]$bridgeReport.coverage.complete;coverageLimitation=$bridgeReport.coverage.limitation}
  [IO.File]::AppendAllText($statusLog, (($status | ConvertTo-Json -Compress) + "`n"))
  Write-Output ($status | ConvertTo-Json -Compress)
} catch {
  $message = $_.Exception.Message
  if ($message.Length -gt 240) { $message = $message.Substring(0,240) }
  [IO.File]::AppendAllText($statusLog, (([ordered]@{at=(Get-Date).ToUniversalTime().ToString('o');status='failed';reason=$message} | ConvertTo-Json -Compress) + "`n"))
  throw
}
