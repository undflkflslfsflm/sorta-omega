[CmdletBinding()]
param(
  [ValidateRange(1,168)][int]$LookbackHours = 48
)

$ErrorActionPreference = 'Stop'
$since = (Get-Date).AddHours(-$LookbackHours)
$eventIds = @(1, 41, 42, 107, 1074, 6005, 6006, 6008)
$events = @(Get-WinEvent -FilterHashtable @{ LogName = 'System'; StartTime = $since; Id = $eventIds } -ErrorAction SilentlyContinue |
  Sort-Object TimeCreated -Descending |
  Select-Object -First 30 TimeCreated, Id, ProviderName, LevelDisplayName)

$taskNames = @(
  'SortaOmega-DockerDesktop',
  'SortaOmega-QwenGeneration',
  'SortaOmega-OllamaEmbedding',
  'SortaOmega-LocalWorker',
  'Sorta Omega - InSchool timetable',
  'Sorta Omega - Teams assignments',
  'Sorta Omega - Teams class posts',
  'Sorta Omega - Teams PowerPoints'
)
$tasks = foreach ($name in $taskNames) {
  $task = Get-ScheduledTask -TaskName $name -ErrorAction SilentlyContinue
  if (-not $task) { continue }
  $info = Get-ScheduledTaskInfo -TaskName $name
  [pscustomobject]@{
    Name = $name
    State = [string]$task.State
    LogonType = [string]$task.Principal.LogonType
    StartWhenAvailable = [bool]$task.Settings.StartWhenAvailable
    WakeToRun = [bool]$task.Settings.WakeToRun
    LastRunTime = $info.LastRunTime
    LastTaskResult = $info.LastTaskResult
    NextRunTime = $info.NextRunTime
  }
}
$services = @(Get-Service -Name 'Tailscale', 'sshd', 'com.docker.service' -ErrorAction SilentlyContinue |
  Select-Object Name, Status, StartType)
$hostBoot = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
$scheme = @(powercfg.exe /getactivescheme) -join "`n"
$sleep = @(powercfg.exe /query SCHEME_CURRENT SUB_SLEEP STANDBYIDLE) -join "`n"
$hibernate = @(powercfg.exe /query SCHEME_CURRENT SUB_SLEEP HIBERNATEIDLE) -join "`n"
$http = try {
  $response = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:3210/health/ready' -TimeoutSec 3
  [pscustomobject]@{ StatusCode = [int]$response.StatusCode; Error = $null }
} catch {
  [pscustomobject]@{ StatusCode = $null; Error = $_.Exception.GetType().Name }
}

[pscustomobject]@{
  ComputerName = $env:COMPUTERNAME
  CheckedAt = (Get-Date).ToUniversalTime()
  LastBootUpTime = $hostBoot
  Events = $events
  Services = $services
  Tasks = @($tasks)
  ActivePowerScheme = $scheme
  AcSleepQuery = $sleep
  AcHibernateQuery = $hibernate
  SortaReady = $http
}
