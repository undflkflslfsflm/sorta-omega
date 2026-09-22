[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$ModelPath,
  [Parameter(Mandatory)][ValidatePattern('^[0-9a-fA-F]{64}$')][string]$ExpectedSha256,
  [string]$LogDirectory = (Join-Path $env:LOCALAPPDATA 'SortaOmega\logs'),
  [ValidateRange(1024,262144)][int]$ContextSize = 4096,
  [ValidateRange(1,65535)][int]$Port = 8000
)

$ErrorActionPreference = 'Stop'
$model = Get-Item -LiteralPath ([IO.Path]::GetFullPath($ModelPath)) -ErrorAction Stop
if ($model.PSIsContainer) { throw 'ModelPath must identify a GGUF file.' }

$actualSha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $model.FullName).Hash.ToLowerInvariant()
if ($actualSha256 -ne $ExpectedSha256.ToLowerInvariant()) {
  throw "Generation model SHA-256 mismatch. Expected $ExpectedSha256, got $actualSha256."
}

$existing = Get-NetTCPConnection -LocalAddress '127.0.0.1' -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($existing) {
  $health = try { Invoke-RestMethod -Uri "http://127.0.0.1:$Port/health" -TimeoutSec 3 } catch { $null }
  if ($health.status -eq 'ok') { exit 0 }
  throw "Loopback port $Port is already in use by a different or unhealthy process."
}

$server = Get-ChildItem (Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages\ggml.llamacpp_*') -Recurse -Filter 'llama-server.exe' -File |
  Select-Object -First 1 -ExpandProperty FullName
if (-not $server) { throw 'llama-server.exe was not found in the WinGet package directory.' }

$runtimeDirectory = Split-Path -Parent $server
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
