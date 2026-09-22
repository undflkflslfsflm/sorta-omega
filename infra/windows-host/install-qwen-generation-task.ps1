[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$RepositoryRoot,
  [Parameter(Mandatory)][string]$ModelPath,
  [Parameter(Mandatory)][ValidatePattern('^[0-9a-fA-F]{64}$')][string]$ExpectedSha256,
  [string]$RuntimeDirectory,
  [string]$TaskName = 'SortaOmega-QwenGeneration'
)

$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath($RepositoryRoot)
$launcher = Join-Path $root 'infra\windows-host\start-qwen-generation-runtime.ps1'
if (-not (Test-Path -LiteralPath $launcher -PathType Leaf)) { throw "Runtime launcher not found: $launcher" }
$model = [IO.Path]::GetFullPath($ModelPath)
if (-not (Test-Path -LiteralPath $model -PathType Leaf)) { throw "Model file not found: $model" }
$localAppData = [Environment]::GetFolderPath('LocalApplicationData')
if ([string]::IsNullOrWhiteSpace($RuntimeDirectory)) {
  if ([string]::IsNullOrWhiteSpace($localAppData)) { throw 'RuntimeDirectory is required when LocalApplicationData is unavailable.' }
  $packageRoot = Join-Path $localAppData 'Microsoft\WinGet\Packages'
  $server = Get-ChildItem -LiteralPath $packageRoot -Directory -Filter 'ggml.llamacpp_*' -ErrorAction SilentlyContinue |
    Get-ChildItem -Recurse -Filter 'llama-server.exe' -File -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty FullName
  if (-not $server) { throw "llama-server.exe was not found under $packageRoot." }
  $RuntimeDirectory = Split-Path -Parent $server
} else {
  $RuntimeDirectory = [IO.Path]::GetFullPath($RuntimeDirectory)
  $server = Join-Path $RuntimeDirectory 'llama-server.exe'
  if (-not (Test-Path -LiteralPath $server -PathType Leaf)) { throw "llama-server.exe was not found: $server" }
}
$logDirectory = Join-Path $localAppData 'SortaOmega\logs'

$quotedLauncher = '"' + $launcher.Replace('"','""') + '"'
$quotedModel = '"' + $model.Replace('"','""') + '"'
$quotedRuntimeDirectory = '"' + $RuntimeDirectory.Replace('"','""') + '"'
$quotedLogDirectory = '"' + $logDirectory.Replace('"','""') + '"'
$arguments = "-NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -File $quotedLauncher -ModelPath $quotedModel -ExpectedSha256 $ExpectedSha256 -RuntimeDirectory $quotedRuntimeDirectory -LogDirectory $quotedLogDirectory"
$currentIdentity = [Security.Principal.WindowsIdentity]::GetCurrent().Name
if ([string]::IsNullOrWhiteSpace($currentIdentity)) { throw 'Current Windows identity could not be resolved.' }
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $arguments -WorkingDirectory $root
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $currentIdentity
$principal = New-ScheduledTaskPrincipal -UserId $currentIdentity -LogonType S4U -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description 'Loopback-only Qwen3.8-Flash-Next runtime for Sorta Omega.' -Force | Out-Null
Start-ScheduledTask -TaskName $TaskName

$deadline = (Get-Date).AddMinutes(10)
do {
  Start-Sleep -Seconds 5
  $task = Get-ScheduledTask -TaskName $TaskName
  $info = Get-ScheduledTaskInfo -TaskName $TaskName
  $health = try { Invoke-RestMethod -Uri 'http://127.0.0.1:8000/health' -TimeoutSec 3 } catch { $null }
  if ($health.status -eq 'ok') {
    [ordered]@{ taskName=$TaskName; state=[string]$task.State; lastTaskResult=$info.LastTaskResult; endpoint='http://127.0.0.1:8000'; health='ok' } |
      ConvertTo-Json -Compress
    exit 0
  }
} while ((Get-Date) -lt $deadline -and $task.State -in @('Running','Ready'))

throw "Scheduled generation runtime did not become healthy. Task state=$($task.State), last result=$($info.LastTaskResult)."
