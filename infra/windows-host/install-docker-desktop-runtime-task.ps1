[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$RepositoryRoot,
  [string]$TaskName = 'SortaOmega-DockerDesktop'
)

$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath($RepositoryRoot)
$launcher = Join-Path $root 'infra\windows-host\start-docker-desktop-runtime.ps1'
if (-not (Test-Path -LiteralPath $launcher -PathType Leaf)) { throw "Docker runtime launcher not found: $launcher" }

$quotedLauncher = '"' + $launcher.Replace('"','""') + '"'
$arguments = "-NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -File $quotedLauncher"
$identity = [Security.Principal.WindowsIdentity]::GetCurrent().Name
if ([string]::IsNullOrWhiteSpace($identity)) { throw 'Current Windows identity could not be resolved.' }

$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $arguments -WorkingDirectory $root
$trigger = New-ScheduledTaskTrigger -AtStartup
$principal = New-ScheduledTaskPrincipal -UserId $identity -LogonType S4U -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description 'Keeps the private Sorta Omega Docker Desktop engine available without an SSH session.' -Force | Out-Null
Start-ScheduledTask -TaskName $TaskName

$docker = 'C:\Program Files\Docker\Docker\resources\bin\docker.exe'
$deadline = (Get-Date).AddMinutes(2)
do {
  Start-Sleep -Seconds 5
  $previousErrorActionPreference = $ErrorActionPreference
  try {
    $ErrorActionPreference = 'Continue'
    & $docker info --format '{{.ServerVersion}}' *> $null
    $dockerReady = $LASTEXITCODE -eq 0
  } finally {
    $ErrorActionPreference = $previousErrorActionPreference
  }
  if ($dockerReady) {
    $task = Get-ScheduledTask -TaskName $TaskName
    [ordered]@{ taskName=$TaskName; state=[string]$task.State; docker='ready' } | ConvertTo-Json -Compress
    exit 0
  }
} while ((Get-Date) -lt $deadline)

$task = Get-ScheduledTask -TaskName $TaskName
$info = Get-ScheduledTaskInfo -TaskName $TaskName
throw "Docker runtime did not become ready. Task state=$($task.State), last result=$($info.LastTaskResult)."
