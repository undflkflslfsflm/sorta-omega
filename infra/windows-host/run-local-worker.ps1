[CmdletBinding()]
param([Parameter(Mandatory)][string]$Repository)

$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath($Repository)
$worker = Join-Path $root 'apps\local-worker\dist\worker.js'
if (-not (Test-Path -LiteralPath $worker -PathType Leaf)) { throw 'The built local worker is missing.' }
if (-not (Test-Path -LiteralPath (Join-Path $root '.env') -PathType Leaf)) { throw 'The worker configuration is missing.' }
$node = (Get-Command node -ErrorAction Stop).Source
$logDirectory = Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) 'SortaOmega\logs'
New-Item -ItemType Directory -Force -Path $logDirectory | Out-Null
Set-Location -LiteralPath $root
$ErrorActionPreference = 'Continue'
for (;;) {
  & $node $worker 1>> (Join-Path $logDirectory 'local-worker.out.log') 2>> (Join-Path $logDirectory 'local-worker.err.log')
  $exitCode = if ($null -eq $LASTEXITCODE) { 'unknown' } else { $LASTEXITCODE }
  Add-Content -LiteralPath (Join-Path $logDirectory 'local-worker.err.log') -Value "worker_process_exit=$exitCode"
  Start-Sleep -Seconds 5
}
