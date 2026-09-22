[CmdletBinding()]
param(
  [string]$DockerDesktopPath = 'C:\Program Files\Docker\Docker\Docker Desktop.exe',
  [string]$DockerCliPath = 'C:\Program Files\Docker\Docker\resources\bin\docker.exe',
  [ValidateRange(5,300)][int]$ProbeIntervalSeconds = 15
)

$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $DockerDesktopPath -PathType Leaf)) { throw "Docker Desktop was not found: $DockerDesktopPath" }
if (-not (Test-Path -LiteralPath $DockerCliPath -PathType Leaf)) { throw "Docker CLI was not found: $DockerCliPath" }

$logDirectory = Join-Path $env:ProgramData 'SortaOmega\logs'
New-Item -ItemType Directory -Force -Path $logDirectory | Out-Null
$logPath = Join-Path $logDirectory 'docker-desktop-runtime.log'

function Write-RuntimeLog([string]$Message) {
  Add-Content -LiteralPath $logPath -Value "[$([DateTimeOffset]::Now.ToString('o'))] $Message" -Encoding UTF8
}

while ($true) {
  try {
    $service = Get-Service -Name 'com.docker.service' -ErrorAction Stop
    if ($service.Status -ne 'Running') {
      Start-Service -Name 'com.docker.service'
      Write-RuntimeLog 'Started com.docker.service.'
    }

    & $DockerCliPath info --format '{{.ServerVersion}}' *> $null
    if ($LASTEXITCODE -ne 0) {
      if (-not (Get-Process -Name 'Docker Desktop' -ErrorAction SilentlyContinue)) {
        Start-Process -FilePath $DockerDesktopPath -WindowStyle Hidden
        Write-RuntimeLog 'Started Docker Desktop.'
      }
    }
  } catch {
    Write-RuntimeLog ($_ | Out-String)
  }

  Start-Sleep -Seconds $ProbeIntervalSeconds
}
