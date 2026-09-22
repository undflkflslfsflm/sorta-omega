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
$stdout = Join-Path $LogDirectory 'ollama-embedding.stdout.log'
$stderr = Join-Path $LogDirectory 'ollama-embedding.stderr.log'
$process = Start-Process -FilePath $ollama -ArgumentList @('serve') -WindowStyle Hidden -PassThru -Wait -RedirectStandardOutput $stdout -RedirectStandardError $stderr
exit $process.ExitCode
