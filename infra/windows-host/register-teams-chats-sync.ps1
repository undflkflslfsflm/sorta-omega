param(
  [Parameter(Mandatory = $true)][string]$VaultId,
  [Parameter(Mandatory = $true)][string]$AppContainer
)

$ErrorActionPreference = 'Stop'
$taskName = 'Sorta Omega - Teams chats'
if ($VaultId -notmatch '^[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$') { throw 'A vault UUID is required.' }
if ($AppContainer -notmatch '^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$') { throw 'A literal Docker app container name is required.' }
if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) { throw 'The Teams chat sync task already exists; inspect it before changing it.' }
$repository = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$script = Join-Path $PSScriptRoot 'sync-teams-chats.ps1'
$profile = Join-Path $env:LOCALAPPDATA 'SortaOmega\BrowserBridge\EdgeUserData'
if (-not (Test-Path -LiteralPath $script -PathType Leaf)) { throw 'The Teams chat sync script is missing.' }
$arguments = '-NoProfile -ExecutionPolicy Bypass -File "{0}" -VaultId {1} -AppContainer {2} -RepositoryRoot "{3}" -ProfilePath "{4}"' -f $script,$VaultId,$AppContainer,$repository,$profile
$action = New-ScheduledTaskAction -Execute (Join-Path $PSHOME 'powershell.exe') -Argument $arguments
$trigger = New-ScheduledTaskTrigger -Daily -At 06:15
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 8) -MultipleInstances IgnoreNew
$principal = New-ScheduledTaskPrincipal -UserId "$env:COMPUTERNAME\$env:USERNAME" -LogonType Interactive -RunLevel Limited
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description 'Daily bounded read-only capture of rendered Teams chat text from the existing signed-in Edge profile. It does not create browser tabs persistently or claim full history or attachments.' | Out-Null
$registered = Get-ScheduledTask -TaskName $taskName
if (@($registered.Actions).Count -ne 1 -or $registered.Actions[0].Arguments -ne $arguments) { throw 'The Teams chat task action could not be verified.' }
$registered | Select-Object TaskName,State
