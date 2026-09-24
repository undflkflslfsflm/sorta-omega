param(
  [Parameter(Mandatory = $true)][string]$VaultId,
  [Parameter(Mandatory = $true)][string]$AppContainer,
  [Parameter(Mandatory = $true)][string]$InSchoolOrigin
)

$ErrorActionPreference = 'Stop'
if ($VaultId -notmatch '^[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$') { throw 'A vault UUID is required.' }
if ($AppContainer -notmatch '^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$') { throw 'A literal Docker app container name is required.' }
$origin = [Uri]$InSchoolOrigin
if ($origin.Scheme -ne 'https' -or -not $origin.Host.EndsWith('.inschool.visma.no') -or $origin.AbsolutePath -ne '/' -or $origin.Query -or $origin.Fragment) { throw 'A registered InSchool HTTPS origin is required.' }
$taskName = 'Sorta Omega - InSchool timetable'
$script = Join-Path $PSScriptRoot 'sync-inschool.ps1'
if (-not (Test-Path -LiteralPath $script)) { throw 'The sync script is missing.' }
if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) { throw 'The InSchool sync task already exists; inspect it before changing it.' }
$repository = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$profile = Join-Path $env:LOCALAPPDATA 'SortaOmega\BrowserBridge\EdgeUserData'
$arguments = '-NoProfile -ExecutionPolicy Bypass -File "{0}" -VaultId {1} -AppContainer {2} -InSchoolOrigin {3} -RepositoryRoot "{4}" -ProfilePath "{5}"' -f $script,$VaultId,$AppContainer,$InSchoolOrigin,$repository,$profile
$action = New-ScheduledTaskAction -Execute (Join-Path $PSHOME 'powershell.exe') -Argument $arguments
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(3) -RepetitionInterval (New-TimeSpan -Hours 1) -RepetitionDuration (New-TimeSpan -Days 3650)
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 3) -MultipleInstances IgnoreNew
$principal = New-ScheduledTaskPrincipal -UserId "$env:COMPUTERNAME\$env:USERNAME" -LogonType Interactive -RunLevel Limited
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description 'Refresh only the visible InSchool timetable through the separately signed-in Edge profile. Requires that Edge profile to remain open; no attendance or grades are captured.' | Out-Null
Get-ScheduledTask -TaskName $taskName | Select-Object TaskName,State
