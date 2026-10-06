param(
  [Parameter(Mandatory = $true)][string]$VaultId,
  [Parameter(Mandatory = $true)][string]$AppContainer
)

$ErrorActionPreference = 'Stop'
$spool = [IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA 'SortaOmega\BrowserBridge\spool')).TrimEnd('\')
$name = 'personal-' + [Guid]::NewGuid().ToString('N')
$root = [IO.Path]::GetFullPath((Join-Path $spool $name)).TrimEnd('\')
if ([IO.Path]::GetDirectoryName($root) -ne $spool -or $name -notmatch '^personal-[0-9a-f]{32}$') { throw 'Unsafe spreadsheet test path.' }

function Add-ZipText([IO.Compression.ZipArchive]$Archive, [string]$Name, [string]$Content) {
  $entry = $Archive.CreateEntry($Name)
  $writer = [IO.StreamWriter]::new($entry.Open(), [Text.UTF8Encoding]::new($false))
  try { $writer.Write($Content) } finally { $writer.Dispose() }
}

try {
  New-Item -ItemType Directory -Path (Join-Path $root 'files') -Force | Out-Null
  Add-Type -AssemblyName System.IO.Compression
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  $workbookPath = Join-Path $root 'test.xlsx'
  $archive = [IO.Compression.ZipFile]::Open($workbookPath, [IO.Compression.ZipArchiveMode]::Create)
  try {
    Add-ZipText $archive 'xl/workbook.xml' '<workbook><sheets><sheet name="Import test" r:id="rId1"/></sheets></workbook>'
    Add-ZipText $archive 'xl/_rels/workbook.xml.rels' '<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>'
    Add-ZipText $archive 'xl/worksheets/sheet1.xml' '<worksheet><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Teams spreadsheet import test</t></is></c></row></sheetData></worksheet>'
  } finally { $archive.Dispose() }
  $hash = (Get-FileHash -LiteralPath $workbookPath -Algorithm SHA256).Hash.ToLowerInvariant()
  Move-Item -LiteralPath $workbookPath -Destination (Join-Path (Join-Path $root 'files') $hash)
  $item = [ordered]@{ relativePath = 'Teams/Import test/General/Shared/test.xlsx'; stagedName = $hash; sha256 = $hash; byteLength = (Get-Item -LiteralPath (Join-Path (Join-Path $root 'files') $hash)).Length; modifiedAt = (Get-Date).ToUniversalTime().ToString('o') }
  $manifest = [ordered]@{ version = 'omega_personal_files_v1'; deviceKey = 'teams-sharepoint'; items = @($item) }
  [IO.File]::WriteAllText((Join-Path $root 'manifest.json'), ($manifest | ConvertTo-Json -Depth 8), [Text.UTF8Encoding]::new($false))

  $importer = Join-Path $PSScriptRoot 'import-teams-powerpoints.ps1'
  $lines = @(& $importer -StagingRoot $root -VaultId $VaultId -AppContainer $AppContainer -DryRun)
  $result = $lines[-1] | ConvertFrom-Json
  if ($result.status -ne 'succeeded' -or -not $result.dryRun -or $result.captured -ne 1 -or $result.counts.created -ne 1 -or $result.counts.textExtracted -ne 1 -or $result.counts.originalsStored -ne 0) { throw "The spreadsheet dry run returned unexpected counts: $($result | ConvertTo-Json -Compress -Depth 5)" }
  [pscustomobject]@{ status = 'passed'; dryRun = $true; captured = 1; textExtracted = 1 } | ConvertTo-Json -Compress
} finally {
  if (Test-Path -LiteralPath $root) { Remove-Item -LiteralPath $root -Recurse -Force -ErrorAction Stop }
}
