param(
  [Parameter(Mandatory = $true)][string]$VaultId,
  [Parameter(Mandatory = $true)][string]$AppContainer,
  [string]$RepositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path,
  [string]$ProfilePath = (Join-Path $env:LOCALAPPDATA 'SortaOmega\BrowserBridge\EdgeUserData'),
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
if ($VaultId -notmatch '^[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$') { throw 'A vault UUID is required.' }
if ($AppContainer -notmatch '^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$') { throw 'A literal Docker app container name is required.' }
$statusDirectory = Split-Path -Parent $ProfilePath
New-Item -ItemType Directory -Path $statusDirectory -Force | Out-Null
$statusLog = Join-Path $statusDirectory 'teams-chats-sync-status.jsonl'
$artifact = $null
$containerArtifact = $null
$copied = $false
try {
  $bridge = Join-Path $RepositoryRoot 'apps\browser-bridge\dist\cli.js'
  $compiler = Join-Path $RepositoryRoot 'apps\browser-bridge\node_modules\.bin\tsc.cmd'
  & $compiler -p (Join-Path $RepositoryRoot 'apps\browser-bridge\tsconfig.json') | Out-Null
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $bridge)) { throw 'The Teams browser bridge could not be built.' }
  $portFile = Join-Path $ProfilePath 'DevToolsActivePort'
  if (-not (Test-Path -LiteralPath $portFile)) { throw 'The school Edge profile is not open.' }
  $portText = (Get-Content -LiteralPath $portFile -TotalCount 1).Trim()
  if ($portText -notmatch '^\d{4,5}$') { throw 'The school Edge debugging port is invalid.' }
  $version = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$portText/json/version" -TimeoutSec 3
  if ([int]$version.StatusCode -ne 200) { throw 'The school Edge profile is not responding.' }

  $spool = Join-Path $statusDirectory 'spool'
  New-Item -ItemType Directory -Path $spool -Force | Out-Null
  $name = 'teams-chats-' + [Guid]::NewGuid().ToString('N') + '.json'
  $artifact = Join-Path $spool $name
  $containerArtifact = '/tmp/' + $name
  $bridgeOutput = @(& node $bridge --provider teams-chats --cdp-profile $ProfilePath --noninteractive true --output $artifact)
  if ($LASTEXITCODE -ne 0) { throw 'The Teams chat capture failed.' }
  $report = $bridgeOutput[-1] | ConvertFrom-Json
  if ($report.provider -ne 'teams-chats' -or $report.format -ne 'omega_notes_json_v1' -or [int]$report.itemCount -lt 1 -or [int]$report.itemCount -gt 200 -or [int]$report.coverage.conversations -lt [int]$report.itemCount -or [int]$report.coverage.textMessages -lt [int]$report.itemCount -or [bool]$report.coverage.complete) { throw 'The Teams chat capture report is invalid.' }
  if (Test-Path -LiteralPath $statusLog) {
    $previous = @(Get-Content -LiteralPath $statusLog -Encoding UTF8 | ForEach-Object { try { $_ | ConvertFrom-Json } catch { $null } } | Where-Object { $_ -and $_.status -eq 'succeeded' -and -not $_.dryRun } | Select-Object -Last 1)
    if ($previous.Count -eq 1 -and ([int]$report.coverage.conversations -lt [int]$previous[0].conversations -or [int]$report.itemCount -lt [int]$previous[0].captured)) { throw 'The Teams chat capture is smaller than the previous import; inspect source coverage before accepting it.' }
  }
  & docker cp $artifact "${AppContainer}:$containerArtifact"
  if ($LASTEXITCODE -ne 0) { throw 'The Teams chat snapshot could not be transferred.' }
  $copied = $true
  $importArgs = @('exec', $AppContainer, 'node', '/app/apps/api/dist/import-teams-chats.js', '--vault-id', $VaultId, '--file', $containerArtifact)
  if ($DryRun) { $importArgs += @('--dry-run', 'true') }
  $importOutput = @(& docker @importArgs)
  if ($LASTEXITCODE -ne 0) { throw 'The Teams chat snapshot could not be imported.' }
  $result = $importOutput[-1] | ConvertFrom-Json
  $actions = $result.counts
  if ([bool]$result.dryRun -ne [bool]$DryRun -or [int]$result.itemCount -ne [int]$report.itemCount -or [int]$actions.created + [int]$actions.updated + [int]$actions.unchanged -ne [int]$report.itemCount) { throw 'The Teams chat import report is invalid.' }
  $status = [ordered]@{at=(Get-Date).ToUniversalTime().ToString('o');status='succeeded';dryRun=[bool]$DryRun;conversations=[int]$report.coverage.conversations;textMessages=[int]$report.coverage.textMessages;emptyMessages=[int]$report.coverage.emptyMessages;captured=[int]$report.itemCount;created=[int]$actions.created;updated=[int]$actions.updated;unchanged=[int]$actions.unchanged;coverageComplete=$false}
  [IO.File]::AppendAllText($statusLog, (($status | ConvertTo-Json -Compress) + "`n"))
  Write-Output ($status | ConvertTo-Json -Compress)
} catch {
  $message = $_.Exception.Message
  if ($message.Length -gt 200) { $message = $message.Substring(0, 200) }
  [IO.File]::AppendAllText($statusLog, (([ordered]@{at=(Get-Date).ToUniversalTime().ToString('o');status='failed';reason=$message} | ConvertTo-Json -Compress) + "`n"))
  throw
} finally {
  if ($copied) { & docker exec -u 0 $AppContainer rm $containerArtifact | Out-Null }
  if ($artifact -and (Test-Path -LiteralPath $artifact)) { Remove-Item -LiteralPath $artifact -Force }
}
