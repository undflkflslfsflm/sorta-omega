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
$bridge = Join-Path $RepositoryRoot 'apps\browser-bridge\src\cli.ts'
$tsx = Join-Path $RepositoryRoot 'apps\browser-bridge\node_modules\.bin\tsx.cmd'
if (-not (Test-Path -LiteralPath $bridge) -or -not (Test-Path -LiteralPath $tsx)) { throw 'Install the bridge dependencies before syncing.' }
if (-not (Test-Path -LiteralPath (Join-Path $ProfilePath 'DevToolsActivePort'))) { throw 'The signed-in Edge bridge profile is not running.' }

$spool = Join-Path $env:LOCALAPPDATA 'SortaOmega\BrowserBridge\spool'
New-Item -ItemType Directory -Path $spool -Force | Out-Null
$name = 'inschool-' + [Guid]::NewGuid().ToString('N') + '.json'
$artifact = Join-Path $spool $name
$containerArtifact = '/tmp/' + $name
$copied = $false
try {
  & $tsx $bridge --provider inschool --origin $origin.GetLeftPart([UriPartial]::Authority) --cdp-profile $ProfilePath --noninteractive true --output $artifact
  if ($LASTEXITCODE -ne 0) { throw 'The InSchool browser capture failed.' }
  & docker cp $artifact "${AppContainer}:$containerArtifact"
  if ($LASTEXITCODE -ne 0) { throw 'The snapshot could not be transferred to the app container.' }
  $copied = $true
  & docker exec $AppContainer node /app/apps/api/dist/import-school-snapshot.js --vault-id $VaultId --file $containerArtifact
  if ($LASTEXITCODE -ne 0) { throw 'The InSchool snapshot was not applied.' }
} finally {
  if ($copied) { & docker exec -u 0 $AppContainer rm $containerArtifact | Out-Null }
  if (Test-Path -LiteralPath $artifact) { Remove-Item -LiteralPath $artifact -Force }
}
[IO.File]::AppendAllText($statusLog, (([ordered]@{at=(Get-Date).ToUniversalTime().ToString('o');status='succeeded'} | ConvertTo-Json -Compress) + "`n"))
} catch {
  $message = $_.Exception.Message
  if ($message.Length -gt 240) { $message = $message.Substring(0,240) }
  [IO.File]::AppendAllText($statusLog, (([ordered]@{at=(Get-Date).ToUniversalTime().ToString('o');status='failed';reason=$message} | ConvertTo-Json -Compress) + "`n"))
  throw
}
