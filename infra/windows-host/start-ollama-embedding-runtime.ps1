[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$OllamaPath,
  [string]$LogDirectory
)

$ErrorActionPreference = 'Stop'
$ollama = [IO.Path]::GetFullPath($OllamaPath)
if (-not (Test-Path -LiteralPath $ollama -PathType Leaf)) { throw "Ollama executable not found: $ollama" }
if ([string]::IsNullOrWhiteSpace($LogDirectory)) {
  $LogDirectory = Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) 'SortaOmega\logs'
}
$LogDirectory = [IO.Path]::GetFullPath($LogDirectory)
New-Item -ItemType Directory -Path $LogDirectory -Force | Out-Null

$env:OLLAMA_HOST = '127.0.0.1:11434'
$existing = Get-NetTCPConnection -LocalAddress '127.0.0.1' -LocalPort 11434 -State Listen -ErrorAction SilentlyContinue
if ($existing) {
  $version = try { Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/version' -TimeoutSec 3 } catch { $null }
  $tags = try { Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 3 } catch { $null }
  if ($version.version -and @($tags.models | Where-Object name -eq 'qwen3-embedding:0.6b').Count -gt 0) { exit 0 }
  throw 'Loopback port 11434 is occupied by a different or unhealthy process.'
}
$stdout = Join-Path $LogDirectory 'ollama-embedding.stdout.log'
$stderr = Join-Path $LogDirectory 'ollama-embedding.stderr.log'
$process = Start-Process -FilePath $ollama -ArgumentList @('serve') -WindowStyle Hidden -PassThru -Wait -RedirectStandardOutput $stdout -RedirectStandardError $stderr
exit $process.ExitCode
