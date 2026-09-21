[CmdletBinding()]
param([Parameter(Mandatory)][string]$BackupDirectory,[switch]$Apply,[string]$ConfirmExact)
$ErrorActionPreference='Stop'
$bundle=[IO.Path]::GetFullPath($BackupDirectory)
$manifestPath=Join-Path $bundle 'manifest.json';$dump=Join-Path $bundle 'database.dump';$blobs=Join-Path $bundle 'blobs'
if(!(Test-Path -LiteralPath $manifestPath) -or !(Test-Path -LiteralPath $dump) -or !(Test-Path -LiteralPath $blobs -PathType Container)){throw 'Backup must contain manifest.json, database.dump, and blobs'}
$manifest=Get-Content -Raw -LiteralPath $manifestPath|ConvertFrom-Json
if($manifest.format-ne 'sorta-omega-backup-v2'){throw 'Unsupported backup format'}
$actual=(Get-FileHash -Algorithm SHA256 -LiteralPath $dump).Hash.ToLowerInvariant()
if($actual-ne $manifest.dump_sha256){throw 'Backup hash mismatch; restore refused'}
$listed=@($manifest.blobs)
if($listed.Count-ne [int]$manifest.blob_count){throw 'Blob manifest count mismatch; restore refused'}
$seen=@{}
foreach($entry in $listed){
  $relative=[string]$entry.path
  if(!$relative -or $relative.Contains('\') -or $relative.StartsWith('/') -or $relative.Split('/') -contains '..' -or $seen.ContainsKey($relative)){throw 'Unsafe or duplicate blob manifest path; restore refused'}
  $seen[$relative]=$true
  $candidate=[IO.Path]::GetFullPath((Join-Path $blobs $relative))
  $blobRoot=[IO.Path]::GetFullPath($blobs)+[IO.Path]::DirectorySeparatorChar
  if(!$candidate.StartsWith($blobRoot,[StringComparison]::OrdinalIgnoreCase) -or !(Test-Path -LiteralPath $candidate -PathType Leaf)){throw "Blob missing from backup: $relative"}
  $blobInfo=Get-Item -LiteralPath $candidate
  if($blobInfo.Length-ne [long]$entry.bytes -or (Get-FileHash -Algorithm SHA256 -LiteralPath $candidate).Hash.ToLowerInvariant()-ne [string]$entry.sha256){throw "Blob hash mismatch: $relative"}
}
$actualBlobFiles=@(Get-ChildItem -LiteralPath $blobs -File -Recurse)
if($actualBlobFiles.Count-ne $listed.Count){throw 'Backup contains unlisted blob files; restore refused'}
$temp="/tmp/sorta-restore-$([guid]::NewGuid().ToString('N')).dump"
try {
  & docker compose cp $dump "postgres:$temp"
  if($LASTEXITCODE-ne 0){throw 'Could not stage backup in database container'}
  & docker compose exec -T postgres pg_restore --list $temp
  if($LASTEXITCODE-ne 0){throw 'pg_restore could not read this dump'}
  if(!$Apply){Write-Output "Validation passed for the database and $($listed.Count) immutable blob file(s). No data was changed. Re-run with -Apply -ConfirmExact 'RESTORE SORTA' during maintenance.";exit 0}
  if($ConfirmExact-ne 'RESTORE SORTA'){throw 'Exact restore confirmation missing'}
  & docker compose stop app
  if($LASTEXITCODE-ne 0){throw 'Could not enter maintenance mode'}
  & docker compose exec -T postgres pg_restore --clean --if-exists --no-owner --no-acl --exit-on-error --username=sorta --dbname=sorta_omega $temp
  if($LASTEXITCODE-ne 0){throw 'Restore failed; app remains stopped for inspection'}
  & docker compose exec -T postgres psql --username=sorta --dbname=sorta_omega --set ON_ERROR_STOP=1 --command "UPDATE provider_calendar_actions SET sends_disabled_after_restore=true,reconciliation_required=true,updated_at=now() WHERE state IN ('pending','in_flight','delivery_unknown'); UPDATE integration_connections SET credential_reference=NULL,state=CASE WHEN disconnected_at IS NULL THEN 'authentication_required' ELSE state END,revision=revision+1,updated_at=now() WHERE provider IN ('microsoft','google_calendar');"
  if($LASTEXITCODE-ne 0){throw 'Restore succeeded, but provider-send safety lock could not be applied; app remains stopped'}
  & docker compose run --rm --no-deps --user root --entrypoint sh app -c 'rm -rf /var/lib/sorta/blob-storage/blobs /var/lib/sorta/blob-storage/uploads && mkdir -p /var/lib/sorta/blob-storage/blobs'
  if($LASTEXITCODE-ne 0){throw 'Database restored, but blob storage could not be prepared; app remains stopped'}
  & docker compose cp "$blobs/." 'app:/var/lib/sorta/blob-storage/blobs'
  if($LASTEXITCODE-ne 0){throw 'Database restored, but immutable blobs could not be copied; app remains stopped'}
  & docker compose run --rm --no-deps --user root --entrypoint sh app -c 'chown -R node:node /var/lib/sorta/blob-storage'
  if($LASTEXITCODE-ne 0){throw 'Database and blobs restored, but blob permissions could not be secured; app remains stopped'}
  & docker compose start app
  if($LASTEXITCODE-ne 0){throw 'Data restored but app did not restart'}
  Write-Output "Restore completed with $($listed.Count) verified immutable blob file(s). Provider credentials were not included; reauthorize and review external writes before enabling them."
} finally { & docker compose exec -T postgres rm -f $temp 2>$null | Out-Null }
