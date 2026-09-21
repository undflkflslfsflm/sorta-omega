[CmdletBinding()]
param([Parameter(Mandatory)][string]$Destination)
$ErrorActionPreference='Stop'
$resolved=[IO.Path]::GetFullPath($Destination)
New-Item -ItemType Directory -Force -Path $resolved | Out-Null
$stamp=(Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ')
$bundle=Join-Path $resolved "sorta-omega-$stamp"
New-Item -ItemType Directory -Path $bundle | Out-Null
$dump=Join-Path $bundle 'database.dump'
$blobs=Join-Path $bundle 'blobs'
$containerDump="/tmp/sorta-backup-$stamp.dump"
try {
  & docker compose exec -T postgres pg_dump --format=custom --no-owner --no-acl --username=sorta --dbname=sorta_omega --file=$containerDump
  if($LASTEXITCODE-ne 0){throw 'pg_dump failed'}
  & docker compose cp "postgres:$containerDump" $dump
  if($LASTEXITCODE-ne 0){throw 'Could not copy database dump'}
} finally { & docker compose exec -T postgres rm -f $containerDump 2>$null | Out-Null }
$null=New-Item -ItemType Directory -Path $blobs
& docker compose cp 'app:/var/lib/sorta/blob-storage/blobs/.' $blobs
if($LASTEXITCODE-ne 0){throw 'Could not copy immutable blob originals'}
$hash=(Get-FileHash -Algorithm SHA256 -LiteralPath $dump).Hash.ToLowerInvariant()
$blobFiles=@(Get-ChildItem -LiteralPath $blobs -File -Recurse | Sort-Object FullName)
$blobManifest=@($blobFiles | ForEach-Object {[ordered]@{path=[IO.Path]::GetRelativePath($blobs,$_.FullName).Replace('\','/');sha256=(Get-FileHash -Algorithm SHA256 -LiteralPath $_.FullName).Hash.ToLowerInvariant();bytes=$_.Length}})
$blobBytes=($blobManifest|Measure-Object -Property bytes -Sum).Sum;if($null-eq $blobBytes){$blobBytes=0}
$manifest=[ordered]@{format='sorta-omega-backup-v2';created_at=(Get-Date).ToUniversalTime().ToString('o');database='sorta_omega';dump_file='database.dump';dump_sha256=$hash;dump_bytes=(Get-Item -LiteralPath $dump).Length;blob_directory='blobs';blob_count=$blobManifest.Count;blob_bytes=[long]$blobBytes;blobs=$blobManifest;includes=@('canonical notes and revisions','immutable original blobs','sources and anchors','tasks and calendar','school and study','projects goals and memories','jobs and audit records');external_credentials_included=$false;external_writes_reenabled_on_restore=$false}
$manifest|ConvertTo-Json -Depth 5|Set-Content -LiteralPath (Join-Path $bundle 'manifest.json') -Encoding utf8
Write-Output $bundle
