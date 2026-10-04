[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$Repository,
  [string]$AppContainer = 'sorta-omega-git-app-1',
  [string]$PostgresContainer = 'sorta-omega-git-postgres-1'
)

$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath($Repository)
$envPath = Join-Path $root '.env'
$workerPath = Join-Path $root 'apps\local-worker\dist\worker.js'
if (-not (Test-Path -LiteralPath $envPath -PathType Leaf)) { throw 'The host .env file is missing.' }
if (-not (Test-Path -LiteralPath $workerPath -PathType Leaf)) { throw 'The built local worker is missing.' }

function Get-EnvValue([string]$Contents, [string]$Name) {
  $match = [regex]::Match($Contents, "(?m)^$([regex]::Escape($Name))=(.*)$")
  if (-not $match.Success) { return $null }
  return $match.Groups[1].Value.Trim().Trim('"', "'")
}

function Set-EnvValue([string]$Contents, [string]$Name, [string]$Value) {
  $pattern = "(?m)^$([regex]::Escape($Name))=.*$"
  if ([regex]::IsMatch($Contents, $pattern)) {
    return [regex]::Replace($Contents, $pattern, "$Name=$Value")
  }
  return $Contents.TrimEnd("`r", "`n") + "`r`n$Name=$Value`r`n"
}

$contents = [IO.File]::ReadAllText($envPath)
$backend = Get-EnvValue $contents 'LOCAL_CHAT_BACKEND'
if ($backend -notin @('ollama', 'openai_compatible')) { throw 'The selected generation backend is not supported.' }
if ((Get-EnvValue $contents 'OPENAI_COMPATIBLE_CHAT_MODEL') -ne 'Qwen/Qwen3.8-Flash-Next') { throw 'The selected generation model does not match the verified target.' }
if ((Get-EnvValue $contents 'OPENAI_COMPATIBLE_CHAT_MODEL_DIGEST') -ne '2e0f14e7eeddce8f80fc88cf96a9cc641b4f60549318fb53e30af85649883586') { throw 'The generation artifact digest does not match retained verification.' }
if ((Get-EnvValue $contents 'OLLAMA_EMBEDDING_MODEL') -ne 'qwen3-embedding:0.6b') { throw 'The embedding model does not match the verified target.' }

$apiUrl = Get-EnvValue $contents 'OMEGA_API_URL'
if (-not $apiUrl -or ([uri]$apiUrl).Host -notin @('127.0.0.1', 'localhost')) { throw 'Worker API URL must use host loopback.' }
$modelUrl = Get-EnvValue $contents 'OPENAI_COMPATIBLE_BASE_URL'
if (-not $modelUrl -or ([uri]$modelUrl).Host -notin @('127.0.0.1', 'localhost')) { throw 'Generation API URL must use host loopback.' }
$models = Invoke-RestMethod -Uri ([uri]::new([uri]$modelUrl, 'models')) -TimeoutSec 5
if ('Qwen/Qwen3.8-Flash-Next' -notin @($models.data | ForEach-Object { $_.id })) { throw 'The verified generation model is not served on host loopback.' }

$running = @(Get-CimInstance Win32_Process -Filter "name = 'node.exe'" | Where-Object { $_.CommandLine -match 'apps[/\\]local-worker[/\\]dist[/\\]worker\.js' })
if ($running.Count -gt 0) { throw 'A local worker process is already running; inspect it before provisioning another.' }

$containerProbe = & docker exec $AppContainer node --version 2>$null
if ($LASTEXITCODE -ne 0) { throw 'The app container is not reachable.' }
if ($backend -eq 'ollama') {
  $contents = Set-EnvValue $contents 'LOCAL_CHAT_BACKEND' 'openai_compatible'
  [IO.File]::WriteAllText($envPath, $contents, [Text.UTF8Encoding]::new($false))
  Push-Location $root
  try {
    & docker compose up -d --no-deps app | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'App recreation with the selected generation backend failed.' }
  } finally { Pop-Location }
  $healthy = $false
  for ($attempt = 0; $attempt -lt 24; $attempt++) {
    Start-Sleep -Seconds 2
    $health = & docker inspect --format '{{.State.Health.Status}}' $AppContainer 2>$null
    if ($health -eq 'healthy') { $healthy = $true; break }
  }
  if (-not $healthy) { throw 'App container did not become healthy after backend correction.' }
}
$workerCount = & docker exec $PostgresContainer psql -U sorta -d sorta_omega -t -A -c 'select count(*) from workers where revoked_at is null;'
if ($LASTEXITCODE -ne 0 -or "$workerCount" -notmatch '^\s*\d+\s*$') { throw 'Could not determine the current worker enrollment count.' }
if ([int]"$workerCount" -eq 0) {
  $provision = & docker exec $AppContainer node /app/apps/api/dist/provision-worker.js --name Home-RTX-worker
  if ($LASTEXITCODE -ne 0) { throw 'Worker provisioning failed.' }
  $credential = ($provision -join "`n") | ConvertFrom-Json
  if (-not $credential.worker_id -or -not $credential.worker_token_once) { throw 'Worker provisioning returned no credential.' }
  $contents = Set-EnvValue $contents 'OMEGA_WORKER_ID' $credential.worker_id
  $contents = Set-EnvValue $contents 'OMEGA_WORKER_TOKEN' $credential.worker_token_once
  [IO.File]::WriteAllText($envPath, $contents, [Text.UTF8Encoding]::new($false))
  $credential = $null
  $provision = $null
} elseif (-not (Get-EnvValue $contents 'OMEGA_WORKER_ID') -or -not (Get-EnvValue $contents 'OMEGA_WORKER_TOKEN')) {
  throw 'A worker is already enrolled but the host credential is unavailable; do not create a duplicate.'
}
Write-Output 'local_worker_configured=true'
