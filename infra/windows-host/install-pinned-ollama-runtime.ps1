[CmdletBinding()]
param([string]$InstallRoot)

$ErrorActionPreference = 'Stop'
$version = '0.35.1'
$expectedSha256 = 'dc50b9ca7f9023c86525012632cd1615b093d0407987444a7f62ecab617e8e93'
$downloadUrl = "https://github.com/ollama/ollama/releases/download/v$version/ollama-windows-amd64.zip"
if ([string]::IsNullOrWhiteSpace($InstallRoot)) {
  $InstallRoot = Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) "SortaOmega\runtimes\ollama-$version"
}
$root = [IO.Path]::GetFullPath($InstallRoot)
$runtime = Join-Path $root 'ollama.exe'
$server = Join-Path $root 'lib\ollama\llama-server.exe'
if ((Test-Path -LiteralPath $runtime -PathType Leaf) -and (Test-Path -LiteralPath $server -PathType Leaf)) {
  Write-Output "ollama_runtime_ready=$runtime"
  exit 0
}
if (Test-Path -LiteralPath $root) { throw 'The target runtime directory exists but is incomplete; inspect it before retrying.' }
$downloadDirectory = Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) 'SortaOmega\downloads'
New-Item -ItemType Directory -Force -Path $downloadDirectory | Out-Null
$archive = Join-Path $downloadDirectory "ollama-windows-amd64-$version.zip"
if (-not (Test-Path -LiteralPath $archive -PathType Leaf)) {
  Start-BitsTransfer -Source $downloadUrl -Destination $archive -ErrorAction Stop
}
$actualSha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $archive).Hash.ToLowerInvariant()
if ($actualSha256 -ne $expectedSha256) { throw 'The official Ollama release archive checksum did not match.' }
Expand-Archive -LiteralPath $archive -DestinationPath $root -Force
if (-not (Test-Path -LiteralPath $runtime -PathType Leaf)) { throw 'The release archive did not contain ollama.exe at the expected path.' }
if (-not (Test-Path -LiteralPath $server -PathType Leaf)) { throw 'The release archive did not contain the model runner at the expected path.' }
Write-Output "ollama_runtime_ready=$runtime"
