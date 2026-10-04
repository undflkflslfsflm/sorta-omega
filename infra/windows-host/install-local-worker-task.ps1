[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$Repository,
  [Parameter(Mandatory)][string]$RunnerPath,
  [string]$TaskName = 'SortaOmega-LocalWorker'
)

$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath($Repository)
$runner = [IO.Path]::GetFullPath($RunnerPath)
if (-not (Test-Path -LiteralPath $runner -PathType Leaf)) { throw 'The worker runner is missing.' }
if (-not (Test-Path -LiteralPath (Join-Path $root 'apps\local-worker\dist\worker.js') -PathType Leaf)) { throw 'The built local worker is missing.' }
$identity = [Security.Principal.WindowsIdentity]::GetCurrent().Name
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$runner`" -Repository `"$root`"" -WorkingDirectory $root
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $identity
$principal = New-ScheduledTaskPrincipal -UserId $identity -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Seconds 0) -RestartInterval (New-TimeSpan -Minutes 1) -RestartCount 10 -MultipleInstances IgnoreNew
Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description 'Owner-host local AI worker; authenticated over loopback only.' -Force | Out-Null
Write-Output "local_worker_task_installed=$TaskName"
