param(
    [string]$ConfigPath = (Join-Path $env:LOCALAPPDATA 'SortaOmega\meetily-companion\config.json'),
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$vaultId = '00000000-0000-4000-8000-000000000001'
$defaultFolder = Join-Path ([Environment]::GetFolderPath('MyMusic')) 'meetily-recordings'

function Read-Recording([System.IO.DirectoryInfo]$folder) {
    if (($folder.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { return $null }
    $metadataFile = Join-Path $folder.FullName 'metadata.json'
    $transcriptFile = Join-Path $folder.FullName 'transcripts.json'
    if (!(Test-Path -LiteralPath $metadataFile -PathType Leaf) -or !(Test-Path -LiteralPath $transcriptFile -PathType Leaf)) { return $null }
    $metadataInfo = Get-Item -LiteralPath $metadataFile
    $transcriptInfo = Get-Item -LiteralPath $transcriptFile
    if ($metadataInfo.Length -gt 1MB -or $transcriptInfo.Length -gt 20MB) { return $null }
    if (($metadataInfo.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0 -or ($transcriptInfo.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { return $null }
    if ($metadataInfo.LastWriteTimeUtc -gt [DateTime]::UtcNow.AddSeconds(-15) -or $transcriptInfo.LastWriteTimeUtc -gt [DateTime]::UtcNow.AddSeconds(-15)) { return $null }
    try {
        $metadata = Get-Content -LiteralPath $metadataFile -Raw -Encoding UTF8 | ConvertFrom-Json
        $transcript = Get-Content -LiteralPath $transcriptFile -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($metadata.status -ne 'completed' -or @($transcript.segments).Count -lt 1 -or @($transcript.segments).Count -gt 5000) { return $null }
        $started = [DateTimeOffset]::Parse([string]$metadata.created_at).ToUniversalTime()
        $completed = [DateTimeOffset]::Parse([string]$metadata.completed_at).ToUniversalTime()
        if ($completed -lt $started) { return $null }
        $meetingId = [string]$metadata.meeting_id
        if ([string]::IsNullOrWhiteSpace($meetingId)) { $meetingId = $folder.Name }
        $title = [string]$metadata.meeting_name
        if ([string]::IsNullOrWhiteSpace($title)) { $title = 'Class recording ' + $started.ToString('yyyy-MM-dd') }
        if ($meetingId.Length -gt 240 -or $title.Length -gt 240) { return $null }
        $segments = New-Object System.Collections.Generic.List[object]
        $ids = New-Object 'System.Collections.Generic.HashSet[string]'
        $index = 0
        foreach ($segment in $transcript.segments) {
            $index++
            $text = [string]$segment.text
            if ([string]::IsNullOrWhiteSpace($text) -or $text.Length -gt 20000) { return $null }
            $start = [double]$segment.audio_start_time
            $end = [double]$segment.audio_end_time
            if ([double]::IsNaN($start) -or [double]::IsNaN($end) -or $start -lt 0 -or $end -le $start) { return $null }
            $id = [string]$segment.id
            if ([string]::IsNullOrWhiteSpace($id)) { $id = 'segment-' + $index }
            if ($id.Length -gt 120 -or !$ids.Add($id)) { return $null }
            $segments.Add(@{ id = $id; startMs = [int][Math]::Round($start * 1000); endMs = [int][Math]::Round($end * 1000); text = $text.Trim(); speaker = @{ id = $null; label = 'Unknown speaker'; status = 'unknown' } })
        }
        $fingerprint = (Get-FileHash -LiteralPath $transcriptFile -Algorithm SHA256).Hash + ':' + (Get-FileHash -LiteralPath $metadataFile -Algorithm SHA256).Hash
        return @{ fingerprint = $fingerprint; meetingId = $meetingId; title = $title; startedAt = $started.ToString('o'); completedAt = $completed.ToString('o'); segments = $segments.ToArray(); ownerConfirmedRecordingApproval = $true; lessonId = $null }
    } catch { return $null }
}

if (!(Test-Path -LiteralPath $ConfigPath -PathType Leaf)) {
    if (!$DryRun) { throw 'Meetily companion is not enrolled.' }
    $config = @{ origin = 'https://silent-4090.tail19ab4a.ts.net'; recordingsPath = $defaultFolder }
} else {
    $config = Get-Content -LiteralPath $ConfigPath -Raw -Encoding UTF8 | ConvertFrom-Json
}
$origin = [Uri]([string]$config.origin)
if ($origin.Scheme -ne 'https' -or $origin.Host -ne 'silent-4090.tail19ab4a.ts.net' -or $origin.AbsolutePath -ne '/' -or $origin.Query -or $origin.Fragment) { throw 'Unexpected Sorta host configuration.' }
$recordingsPath = [string]$config.recordingsPath
if ([string]::IsNullOrWhiteSpace($recordingsPath)) { $recordingsPath = $defaultFolder }
$expectedFolder = [IO.Path]::GetFullPath($defaultFolder).TrimEnd('\')
if ([IO.Path]::GetFullPath($recordingsPath).TrimEnd('\') -ne $expectedFolder) { throw 'Recording path is not Meetily default Music folder.' }
if (!(Test-Path -LiteralPath $recordingsPath -PathType Container)) {
    Write-Output 'Meetily companion: 0 completed recordings (folder absent).'
    return
}

$statePath = Join-Path (Split-Path -Parent $ConfigPath) 'state.json'
$state = @{}
if (Test-Path -LiteralPath $statePath -PathType Leaf) {
    try { $loaded = Get-Content -LiteralPath $statePath -Raw -Encoding UTF8 | ConvertFrom-Json; foreach ($property in $loaded.PSObject.Properties) { $state[$property.Name] = [string]$property.Value } } catch { $state = @{} }
}
$token = $null
if (!$DryRun) {
    $credentialPath = Join-Path (Split-Path -Parent $ConfigPath) 'credential.dpapi'
    $protected = Get-Content -LiteralPath $credentialPath -Raw -Encoding UTF8 | ConvertTo-SecureString
    $token = (New-Object System.Management.Automation.PSCredential('sorta', $protected)).GetNetworkCredential().Password
    if ($token -notmatch '^sat_[A-Za-z0-9_-]{40,64}$') { throw 'Meetily companion credential is invalid.' }
}
$eligible = 0; $imported = 0; $unchanged = 0; $failed = 0
foreach ($folder in (Get-ChildItem -LiteralPath $recordingsPath -Directory -ErrorAction Stop)) {
    $recording = Read-Recording $folder
    if (!$recording) { continue }
    $eligible++
    if ($state[$recording.meetingId] -eq $recording.fingerprint) { $unchanged++; continue }
    if ($DryRun) { continue }
    $fingerprint = $recording.fingerprint
    $meetingId = $recording.meetingId
    $recording.Remove('fingerprint')
    try {
        $body = ConvertTo-Json -InputObject $recording -Depth 12 -Compress
        $result = Invoke-RestMethod -Uri ($origin.AbsoluteUri.TrimEnd('/') + '/api/v1/vaults/' + $vaultId + '/transcripts/meetily-import') -Method Post -ContentType 'application/json; charset=utf-8' -Headers @{ Authorization = 'Bearer ' + $token } -Body ([Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 30
        if ($null -eq $result -or $null -eq $result.imported -or [string]::IsNullOrWhiteSpace([string]$result.transcript.id)) { throw 'Unexpected import response.' }
        $state[$meetingId] = $fingerprint
        if ($result.imported) { $imported++ } else { $unchanged++ }
    } catch {
        $failed++
    }
}
if (!$DryRun) {
    $json = ConvertTo-Json -InputObject $state -Depth 3 -Compress
    $temporary = $statePath + '.tmp'
    Set-Content -LiteralPath $temporary -Value $json -Encoding UTF8
    Move-Item -LiteralPath $temporary -Destination $statePath -Force
}
Write-Output "Meetily companion: $eligible eligible, $imported imported, $unchanged unchanged, $failed failed."
if ($failed) { exit 1 }
