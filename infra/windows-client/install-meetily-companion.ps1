param(
    [string]$Origin = 'https://silent-4090.tail19ab4a.ts.net',
    [switch]$TokenFromStdin,
    [switch]$SkipTask
)

$ErrorActionPreference = 'Stop'
$base = Join-Path $env:LOCALAPPDATA 'SortaOmega\meetily-companion'
$source = Join-Path $PSScriptRoot 'meetily-companion.ps1'
$target = Join-Path $base 'meetily-companion.ps1'
$music = Join-Path ([Environment]::GetFolderPath('MyMusic')) 'meetily-recordings'
if (!(Test-Path -LiteralPath $source -PathType Leaf)) { throw 'Companion source script is missing.' }
New-Item -ItemType Directory -Path $base -Force | Out-Null
Copy-Item -LiteralPath $source -Destination $target -Force
$configPath = Join-Path $base 'config.json'
@{ origin = $Origin; recordingsPath = $music } | ConvertTo-Json -Compress | Set-Content -LiteralPath $configPath -Encoding UTF8

if ($TokenFromStdin) {
    $plain = [Console]::In.ReadLine()
    if ($plain -notmatch '^sat_[A-Za-z0-9_-]{40,64}$') { throw 'Expected one scoped Sorta API token on stdin.' }
    $secure = ConvertTo-SecureString -String $plain -AsPlainText -Force
    $plain = $null
    $secure | ConvertFrom-SecureString | Set-Content -LiteralPath (Join-Path $base 'credential.dpapi') -Encoding UTF8
}
if (!$SkipTask) {
    if (!(Test-Path -LiteralPath (Join-Path $base 'credential.dpapi') -PathType Leaf)) { throw 'A scoped credential is required before scheduling.' }
    $name = 'Sorta Omega - Meetily transcript import'
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent().Name
    $action = New-ScheduledTaskAction -Execute (Join-Path $PSHOME 'powershell.exe') -Argument ('-NoProfile -NonInteractive -ExecutionPolicy Bypass -WindowStyle Hidden -File "' + $target + '"')
    $repeatTrigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 5) -RepetitionDuration (New-TimeSpan -Days 3650)
    $loginTrigger = New-ScheduledTaskTrigger -AtLogOn -User $identity
    $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 3) -MultipleInstances IgnoreNew
    $principal = New-ScheduledTaskPrincipal -UserId $identity -LogonType Interactive -RunLevel Limited
    Register-ScheduledTask -TaskName $name -Action $action -Trigger @($loginTrigger, $repeatTrigger) -Settings $settings -Principal $principal -Description 'Read completed local Meetily transcripts and import text to private Sorta. Never starts microphone or uploads audio.' -Force | Out-Null
    Write-Output 'Meetily companion installed. Scheduled every five minutes while signed in; microphone remains off.'
} else {
    Write-Output 'Meetily companion staged without a scheduled task.'
}
