param(
  [Parameter(Mandatory = $true)][string]$StagingRoot,
  [Parameter(Mandatory = $true)][string]$VaultId,
  [Parameter(Mandatory = $true)][string]$AppContainer,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
if ($VaultId -notmatch '^[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$') { throw 'A vault UUID is required.' }
if ($AppContainer -notmatch '^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$') { throw 'A literal Docker app container name is required.' }
$spool = [IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA 'SortaOmega\BrowserBridge\spool')).TrimEnd('\')
$source = [IO.Path]::GetFullPath($StagingRoot).TrimEnd('\')
if ([IO.Path]::GetDirectoryName($source) -ne $spool -or [IO.Path]::GetFileName($source) -notmatch '^personal-[0-9a-f]{32}$') { throw 'The staged scan must be an exact personal-<32hex> directory in the browser-bridge spool.' }
$sourceManifestPath = Join-Path $source 'manifest.json'
if (-not (Test-Path -LiteralPath $sourceManifestPath -PathType Leaf)) { throw 'The complete Teams PowerPoint manifest is missing; nothing was imported.' }
$manifest = Get-Content -LiteralPath $sourceManifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
$items = @($manifest.items)
if ($manifest.version -ne 'omega_personal_files_v1' -or $manifest.deviceKey -ne 'teams-sharepoint' -or $items.Count -lt 1 -or $items.Count -gt 2048) { throw 'The Teams PowerPoint manifest is invalid or empty.' }

$batches = [Collections.Generic.List[object]]::new()
$current = [Collections.Generic.List[object]]::new()
$currentBytes = [long]0
$maxBatchBytes = 290MB
foreach ($item in $items) {
  if ($item.relativePath -notmatch '^Teams/.+\.pptx$' -or $item.stagedName -notmatch '^[0-9a-f]{64}$' -or $item.sha256 -ne $item.stagedName -or [long]$item.byteLength -lt 1 -or [long]$item.byteLength -gt 100MB) { throw 'A Teams PowerPoint manifest item is invalid.' }
  $file = Join-Path (Join-Path $source 'files') $item.stagedName
  if (-not (Test-Path -LiteralPath $file -PathType Leaf) -or (Get-Item -LiteralPath $file).Length -ne [long]$item.byteLength) { throw 'A staged presentation is missing or has changed size.' }
  if ($current.Count -ge 512 -or $currentBytes + [long]$item.byteLength -gt $maxBatchBytes) {
    $batches.Add(@($current.ToArray()))
    $current = [Collections.Generic.List[object]]::new()
    $currentBytes = [long]0
  }
  $current.Add($item)
  $currentBytes += [long]$item.byteLength
}
if ($current.Count) { $batches.Add(@($current.ToArray())) }

$totals = [ordered]@{ created = 0; updated = 0; unchanged = 0; originalsStored = 0; textExtracted = 0; textUnavailable = 0 }
$accounted = 0
foreach ($batchItems in $batches) {
  $name = 'personal-' + [Guid]::NewGuid().ToString('N')
  $batchRoot = Join-Path $spool $name
  $batchFull = [IO.Path]::GetFullPath($batchRoot).TrimEnd('\')
  if ([IO.Path]::GetDirectoryName($batchFull) -ne $spool -or [IO.Path]::GetFileName($batchFull) -notmatch '^personal-[0-9a-f]{32}$') { throw 'Unsafe generated batch path.' }
  $containerRoot = '/tmp/' + $name
  if ($containerRoot -notmatch '^/tmp/personal-[0-9a-f]{32}$') { throw 'Unsafe container batch path.' }
  $copied = $false
  try {
    New-Item -ItemType Directory -Path (Join-Path $batchRoot 'files') | Out-Null
    foreach ($item in $batchItems) {
      $sourceFile = Join-Path (Join-Path $source 'files') $item.stagedName
      $targetFile = Join-Path (Join-Path $batchRoot 'files') $item.stagedName
      if (-not (Test-Path -LiteralPath $targetFile)) { New-Item -ItemType HardLink -Path $targetFile -Target $sourceFile | Out-Null }
    }
    $batchManifest = @{ version = 'omega_personal_files_v1'; deviceKey = 'teams-sharepoint'; items = @($batchItems) }
    [IO.File]::WriteAllText((Join-Path $batchRoot 'manifest.json'), ($batchManifest | ConvertTo-Json -Depth 8), [Text.UTF8Encoding]::new($false))
    & docker cp $batchRoot "${AppContainer}:$containerRoot"
    if ($LASTEXITCODE -ne 0) { throw 'The presentation batch could not be copied to the app container.' }
    $copied = $true
    $arguments = @('exec', $AppContainer, 'node', '/app/apps/api/dist/import-personal-files.js', '--vault-id', $VaultId, '--directory', $containerRoot)
    if ($DryRun) { $arguments += @('--dry-run', 'true') }
    $resultLines = @(& docker @arguments)
    if ($LASTEXITCODE -ne 0) { throw 'The presentation batch import failed.' }
    $result = $resultLines[-1] | ConvertFrom-Json
    if ([int]$result.totalManifestFiles -ne @($batchItems).Count -or [bool]$result.dryRun -ne [bool]$DryRun) { throw 'The presentation importer returned an invalid count.' }
    $count = [int]$result.counts.created + [int]$result.counts.updated + [int]$result.counts.unchanged
    if ($count -ne @($batchItems).Count) { throw 'The presentation importer did not account for each file.' }
    $accounted += $count
    foreach ($key in @($totals.Keys)) { $totals[$key] += [int]$result.counts.$key }
  } finally {
    if ($copied) { & docker exec -u 0 $AppContainer rm -r -- $containerRoot | Out-Null }
    if (Test-Path -LiteralPath $batchFull) { Remove-Item -LiteralPath $batchFull -Recurse -Force }
  }
}
if ($accounted -ne $items.Count) { throw 'The staged scan was not fully accounted for.' }
[ordered]@{ status = 'succeeded'; dryRun = [bool]$DryRun; captured = $items.Count; batches = $batches.Count; counts = $totals; coverageComplete = $false; coverageLimitation = 'Class-channel Shared folders only; Classwork and post attachments still require capture.' } | ConvertTo-Json -Compress
