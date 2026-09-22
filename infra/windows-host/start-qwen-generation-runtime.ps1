[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$ModelPath,
  [Parameter(Mandatory)][ValidatePattern('^[0-9a-fA-F]{64}$')][string]$ExpectedSha256,
  [string]$RuntimeDirectory,
  [string]$LogDirectory,
  [ValidateRange(1024,262144)][int]$ContextSize = 4096,
  [ValidateRange(1,65535)][int]$Port = 8000
)

$ErrorActionPreference = 'Stop'
$model = Get-Item -LiteralPath ([IO.Path]::GetFullPath($ModelPath)) -ErrorAction Stop
if ($model.PSIsContainer) { throw 'ModelPath must identify a GGUF file.' }

$existing = Get-NetTCPConnection -LocalAddress '127.0.0.1' -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($existing) {
  $health = try { Invoke-RestMethod -Uri "http://127.0.0.1:$Port/health" -TimeoutSec 3 } catch { $null }
  $models = try { Invoke-RestMethod -Uri "http://127.0.0.1:$Port/v1/models" -TimeoutSec 3 } catch { $null }
  if ($health.status -eq 'ok' -and $models.data.id -contains 'Qwen/Qwen3.8-Flash-Next') { exit 0 }
  throw "Loopback port $Port is already in use by a different or unhealthy process."
}

$actualSha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $model.FullName).Hash.ToLowerInvariant()
if ($actualSha256 -ne $ExpectedSha256.ToLowerInvariant()) {
  throw "Generation model SHA-256 mismatch. Expected $ExpectedSha256, got $actualSha256."
}

$localAppData = [Environment]::GetFolderPath('LocalApplicationData')
if ([string]::IsNullOrWhiteSpace($RuntimeDirectory)) {
  if ([string]::IsNullOrWhiteSpace($localAppData)) { throw 'RuntimeDirectory is required when LocalApplicationData is unavailable.' }
  $packageRoot = Join-Path $localAppData 'Microsoft\WinGet\Packages'
  $server = Get-ChildItem -LiteralPath $packageRoot -Directory -Filter 'ggml.llamacpp_*' -ErrorAction SilentlyContinue |
    Get-ChildItem -Recurse -Filter 'llama-server.exe' -File -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty FullName
  $RuntimeDirectory = if ($server) { Split-Path -Parent $server } else { $null }
} else {
  $RuntimeDirectory = [IO.Path]::GetFullPath($RuntimeDirectory)
  $server = Join-Path $RuntimeDirectory 'llama-server.exe'
}
if (-not $server) { throw 'llama-server.exe was not found in the WinGet package directory.' }
if (-not (Test-Path -LiteralPath $server -PathType Leaf)) { throw "llama-server.exe was not found: $server" }

$runtimeDirectory = Split-Path -Parent $server
if ([string]::IsNullOrWhiteSpace($LogDirectory)) {
  if ([string]::IsNullOrWhiteSpace($localAppData)) { throw 'LogDirectory is required when LocalApplicationData is unavailable.' }
  $LogDirectory = Join-Path $localAppData 'SortaOmega\logs'
}
$resolvedLogDirectory = [IO.Path]::GetFullPath($LogDirectory)
New-Item -ItemType Directory -Force -Path $resolvedLogDirectory | Out-Null
$stdoutLog = Join-Path $resolvedLogDirectory 'qwen-generation.out.log'
$stderrLog = Join-Path $resolvedLogDirectory 'qwen-generation.err.log'

Push-Location $runtimeDirectory
try {
  $serverArguments = @(
    '--model', $model.FullName,
    '--alias', 'Qwen/Qwen3.8-Flash-Next',
    '--host', '127.0.0.1',
    '--port', [string]$Port,
    '--ctx-size', [string]$ContextSize,
    '--parallel', '1',
    '--n-gpu-layers', 'auto',
    '--metrics'
  )
  & $server @serverArguments 1>> $stdoutLog 2>> $stderrLog
  if ($LASTEXITCODE -ne 0) { throw "llama-server exited with code $LASTEXITCODE." }
} finally {
  Pop-Location
}
