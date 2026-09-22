[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$RepositoryRoot,
  [string]$OllamaPath,
  [string]$TaskName = 'SortaOmega-OllamaEmbedding'
)

$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath($RepositoryRoot)
$launcher = Join-Path $root 'infra\windows-host\start-ollama-embedding-runtime.ps1'
if (-not (Test-Path -LiteralPath $launcher -PathType Leaf)) { throw "Runtime launcher not found: $launcher" }
if ([string]::IsNullOrWhiteSpace($OllamaPath)) {
  $candidates = @(
    (Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) 'Programs\Ollama\ollama.exe'),
    (Join-Path $env:ProgramFiles 'Ollama\ollama.exe')
  )
  $OllamaPath = $candidates | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1
}
if ([string]::IsNullOrWhiteSpace($OllamaPath)) { throw 'Ollama executable was not found in a recognized install location.' }
$ollama = [IO.Path]::GetFullPath($OllamaPath)
$logDirectory = Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) 'SortaOmega\logs'
$quotedLauncher = '"' + $launcher.Replace('"','""') + '"'
$quotedOllama = '"' + $ollama.Replace('"','""') + '"'
$quotedLogDirectory = '"' + $logDirectory.Replace('"','""') + '"'
$arguments = "-NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -File $quotedLauncher -OllamaPath $quotedOllama -LogDirectory $quotedLogDirectory"
$identity = [Security.Principal.WindowsIdentity]::GetCurrent().Name
if ([string]::IsNullOrWhiteSpace($identity)) { throw 'Current Windows identity could not be resolved.' }
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $arguments -WorkingDirectory $root
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $identity
$principal = New-ScheduledTaskPrincipal -UserId $identity -LogonType S4U -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description 'Loopback-only Ollama embedding runtime for Sorta Omega.' -Force | Out-Null
Start-ScheduledTask -TaskName $TaskName

$deadline = (Get-Date).AddMinutes(2)
do {
  Start-Sleep -Seconds 2
  $task = Get-ScheduledTask -TaskName $TaskName
  $info = Get-ScheduledTaskInfo -TaskName $TaskName
  $version = try { Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/version' -TimeoutSec 3 } catch { $null }
  $tags = try { Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 3 } catch { $null }
  $model = @($tags.models | Where-Object name -eq 'qwen3-embedding:0.6b') | Select-Object -First 1
  if ($version.version -and $model.digest) {
    [ordered]@{ taskName=$TaskName; state=[string]$task.State; lastTaskResult=$info.LastTaskResult; endpoint='http://127.0.0.1:11434'; version=[string]$version.version; model=[string]$model.name; digest=[string]$model.digest } | ConvertTo-Json -Compress
    exit 0
  }
} while ((Get-Date) -lt $deadline -and $task.State -in @('Running','Ready'))

throw "Scheduled Ollama runtime did not become ready with qwen3-embedding:0.6b. Task state=$($task.State), last result=$($info.LastTaskResult)."
