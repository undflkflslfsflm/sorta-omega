[CmdletBinding()]
param(
  [string]$CanonicalOrigin,
  [string]$BlobRoot,
  [string]$BackupRoot,
  [switch]$PrepareStorage,
  [switch]$SkipRepositoryGates
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$evidenceRoot = Join-Path $repoRoot 'docs\evidence'
$runId = (Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ')
$reportPath = Join-Path $evidenceRoot "rtx4090-preflight-$runId.json"
$hostDoctorPath = Join-Path $evidenceRoot "host-doctor-$runId.json"
$checks = [System.Collections.Generic.List[object]]::new()
$blockers = [System.Collections.Generic.List[string]]::new()

function Add-Check {
  param(
    [Parameter(Mandatory)][string]$Name,
    [Parameter(Mandatory)][bool]$Passed,
    [Parameter(Mandatory)][bool]$Required,
    [Parameter(Mandatory)][string]$Detail
  )

  $checks.Add([ordered]@{
    name = $Name
    passed = $Passed
    required = $Required
    detail = $Detail
  })
  if ($Required -and -not $Passed) {
    $blockers.Add("${Name}: $Detail")
  }
}

function Test-CommandAvailable([string]$Name) {
  return $null -ne (Get-Command -Name $Name -ErrorAction SilentlyContinue)
}

function Invoke-NativeCheck {
  param(
    [Parameter(Mandatory)][string]$Name,
    [Parameter(Mandatory)][string]$File,
    [Parameter(Mandatory)][string[]]$Arguments,
    [bool]$Required = $true
  )

  if (-not (Test-CommandAvailable $File)) {
    Add-Check -Name $Name -Passed $false -Required $Required -Detail "$File is not installed or is not on PATH"
    return
  }

  try {
    $output = (& $File @Arguments 2>&1 | Out-String).Replace([char]0, '').Trim()
    $exitCode = $LASTEXITCODE
  } catch {
    Add-Check -Name $Name -Passed $false -Required $Required -Detail $_.Exception.Message
    return
  }
  $safeOutput = if ($output.Length -gt 2000) { $output.Substring(0, 2000) + '…' } else { $output }
  Add-Check -Name $Name -Passed ($exitCode -eq 0) -Required $Required -Detail "exit=$exitCode $safeOutput"
}

function Test-SafeStoragePath {
  param([AllowEmptyString()][string]$PathValue)

  if ([string]::IsNullOrWhiteSpace($PathValue)) { return $false }
  if (-not [System.IO.Path]::IsPathFullyQualified($PathValue)) { return $false }
  $fullPath = [System.IO.Path]::GetFullPath($PathValue).TrimEnd('\')
  $root = [System.IO.Path]::GetPathRoot($fullPath).TrimEnd('\')
  return $fullPath -ne $root
}

function Test-LoopbackEndpoint([string]$Value) {
  $endpoint = $null
  return [Uri]::TryCreate($Value, [UriKind]::Absolute, [ref]$endpoint) -and
    $endpoint.Scheme -eq 'http' -and
    $endpoint.Host -in @('127.0.0.1', '[::1]', '::1') -and
    [string]::IsNullOrEmpty($endpoint.UserInfo) -and
    [string]::IsNullOrEmpty($endpoint.Query) -and
    [string]::IsNullOrEmpty($endpoint.Fragment)
}

function Set-OwnerOnlyAcl {
  param([Parameter(Mandatory)][string]$PathValue)

  $inheritance = [System.Security.AccessControl.InheritanceFlags]'ContainerInherit, ObjectInherit'
  $propagation = [System.Security.AccessControl.PropagationFlags]::None
  $allow = [System.Security.AccessControl.AccessControlType]::Allow
  $fullControl = [System.Security.AccessControl.FileSystemRights]::FullControl
  $identities = @(
    [System.Security.Principal.WindowsIdentity]::GetCurrent().User,
    [System.Security.Principal.SecurityIdentifier]::new('S-1-5-18'),
    [System.Security.Principal.SecurityIdentifier]::new('S-1-5-32-544')
  )
  $acl = Get-Acl -LiteralPath $PathValue
  $acl.SetAccessRuleProtection($true, $false)
  foreach ($identity in $identities) {
    $rule = [System.Security.AccessControl.FileSystemAccessRule]::new($identity, $fullControl, $inheritance, $propagation, $allow)
    [void]$acl.AddAccessRule($rule)
  }
  Set-Acl -LiteralPath $PathValue -AclObject $acl
}

New-Item -ItemType Directory -Path $evidenceRoot -Force | Out-Null

$hostDoctorOutput = & (Join-Path $PSScriptRoot 'host-doctor.ps1')
[System.IO.File]::WriteAllText($hostDoctorPath, ($hostDoctorOutput -join [Environment]::NewLine), [System.Text.UTF8Encoding]::new($false))

$os = Get-CimInstance -ClassName Win32_OperatingSystem
Add-Check -Name 'Windows 11 host' -Passed ($os.Caption -like '*Windows 11*') -Required $true -Detail "$($os.Caption) $($os.Version)"

$cpu = Get-CimInstance -ClassName Win32_Processor | Select-Object -First 1
Add-Check -Name 'Expected CPU' -Passed ($cpu.Name -like '*i9-13900KF*') -Required $true -Detail $cpu.Name.Trim()

$system = Get-CimInstance -ClassName Win32_ComputerSystem
$memoryGiB = [math]::Round($system.TotalPhysicalMemory / 1GB, 1)
Add-Check -Name 'System memory' -Passed ($memoryGiB -ge 60) -Required $true -Detail "$memoryGiB GiB detected; at least 60 GiB usable is required"

if (Test-CommandAvailable 'nvidia-smi') {
  $gpuLine = (& nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader,nounits 2>&1 | Select-Object -First 1).ToString()
  $gpuParts = $gpuLine -split ',' | ForEach-Object { $_.Trim() }
  $gpuName = if ($gpuParts.Count -ge 1) { $gpuParts[0] } else { '' }
  $gpuMemoryMiB = 0
  if ($gpuParts.Count -ge 2) { [void][int]::TryParse($gpuParts[1], [ref]$gpuMemoryMiB) }
  Add-Check -Name 'RTX 4090 GPU' -Passed ($LASTEXITCODE -eq 0 -and $gpuName -like '*RTX 4090*' -and $gpuMemoryMiB -ge 24000) -Required $true -Detail "$gpuName; $gpuMemoryMiB MiB; driver $($gpuParts | Select-Object -Last 1)"
} else {
  Add-Check -Name 'RTX 4090 GPU' -Passed $false -Required $true -Detail 'nvidia-smi is not installed or is not on PATH'
}

foreach ($specName in @('OMEGA-APP-SPEC.md', 'OMEGA-MASTER-SPEC.md')) {
  $specPath = Join-Path $repoRoot $specName
  $exists = Test-Path -LiteralPath $specPath -PathType Leaf
  $detail = if ($exists) { (Get-FileHash -Algorithm SHA256 -LiteralPath $specPath).Hash } else { 'missing' }
  Add-Check -Name "Authoritative spec: $specName" -Passed $exists -Required $true -Detail $detail
}

if ([string]::IsNullOrWhiteSpace($CanonicalOrigin)) {
  Add-Check -Name 'Canonical secure origin' -Passed $false -Required $true -Detail 'Pass -CanonicalOrigin after choosing the final localhost or Tailscale Serve HTTPS origin'
} else {
  $originUri = $null
  $parsedOrigin = [System.Uri]::TryCreate($CanonicalOrigin, [System.UriKind]::Absolute, [ref]$originUri)
  $isSecureOrigin = $parsedOrigin -and ($originUri.Scheme -eq 'https' -or
    ($originUri.Scheme -eq 'http' -and $originUri.Host -in @('localhost', '127.0.0.1', '::1')))
  $validOrigin = $isSecureOrigin -and [string]::IsNullOrEmpty($originUri.PathAndQuery.Trim('/'))
  Add-Check -Name 'Canonical secure origin' -Passed $validOrigin -Required $true -Detail $CanonicalOrigin
}

foreach ($storage in @(
  [ordered]@{ name = 'Blob root'; path = $BlobRoot },
  [ordered]@{ name = 'Backup root'; path = $BackupRoot }
)) {
  $safePath = Test-SafeStoragePath -PathValue $storage.path
  if ($PrepareStorage -and $safePath) {
    New-Item -ItemType Directory -Path $storage.path -Force | Out-Null
    Set-OwnerOnlyAcl -PathValue $storage.path
  }
  $exists = $safePath -and (Test-Path -LiteralPath $storage.path -PathType Container)
  Add-Check -Name $storage.name -Passed ($safePath -and $exists) -Required $true -Detail "$($storage.path); use -PrepareStorage to create the reviewed path"
}

if ((Test-SafeStoragePath -PathValue $BlobRoot) -and (Test-SafeStoragePath -PathValue $BackupRoot)) {
  $blobFull = [System.IO.Path]::GetFullPath($BlobRoot).TrimEnd('\')
  $backupFull = [System.IO.Path]::GetFullPath($BackupRoot).TrimEnd('\')
  $blobVolume = [System.IO.Path]::GetPathRoot($blobFull)
  $backupVolume = [System.IO.Path]::GetPathRoot($backupFull)
  Add-Check -Name 'Independent live and backup volumes' -Passed ($blobVolume -ne $backupVolume) -Required $true -Detail "live=$blobFull backup=$backupFull; a differently named folder on the same disk is not an independent backup"
}

Invoke-NativeCheck -Name 'Docker daemon' -File 'docker' -Arguments @('info', '--format', '{{.ServerVersion}}')
Invoke-NativeCheck -Name 'WSL2' -File 'wsl' -Arguments @('--status')
Invoke-NativeCheck -Name 'Rust toolchain' -File 'rustc' -Arguments @('--version')
Invoke-NativeCheck -Name 'Cargo toolchain' -File 'cargo' -Arguments @('--version')
Invoke-NativeCheck -Name 'Tailscale service' -File 'tailscale' -Arguments @('status')
Invoke-NativeCheck -Name 'Ollama service' -File 'ollama' -Arguments @('list')
if (Test-CommandAvailable 'node') {
  $nodeVersionText = (& node --version 2>&1 | Select-Object -First 1).ToString().Trim().TrimStart('v')
  $nodeVersion = $null
  $validNode = [version]::TryParse($nodeVersionText, [ref]$nodeVersion) -and $nodeVersion.Major -eq 22
  Add-Check -Name 'Node.js 22.x' -Passed $validNode -Required $true -Detail "$nodeVersionText; pinned release baseline. Parallel API worker crashes were reported on both Node 22 and 24; use the default single-worker API test command."
} else {
  Add-Check -Name 'Node.js 22.x' -Passed $false -Required $true -Detail 'node is not installed or is not on PATH'
}

if (Test-CommandAvailable 'pnpm') {
  $pnpmVersion = (& pnpm --version 2>&1 | Select-Object -First 1).ToString().Trim()
  Add-Check -Name 'pnpm 10.15.1' -Passed ($LASTEXITCODE -eq 0 -and $pnpmVersion -eq '10.15.1') -Required $true -Detail $pnpmVersion
} else {
  Add-Check -Name 'pnpm 10.15.1' -Passed $false -Required $true -Detail 'pnpm is not installed or is not on PATH; enable Corepack and activate pnpm 10.15.1'
}

$webView2ClientId = '{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}'
$webView2 = @(
  "HKLM:\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\$webView2ClientId",
  "HKLM:\SOFTWARE\Microsoft\EdgeUpdate\Clients\$webView2ClientId",
  "HKCU:\SOFTWARE\Microsoft\EdgeUpdate\Clients\$webView2ClientId"
) | ForEach-Object { Get-ItemProperty -Path $_ -ErrorAction SilentlyContinue } | Select-Object -First 1
Add-Check -Name 'WebView2 Runtime' -Passed ($null -ne $webView2) -Required $true -Detail $(if ($webView2) { $webView2.pv } else { 'WebView2 Runtime registration not found' })

$vswhere = Join-Path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio\Installer\vswhere.exe'
if (Test-Path -LiteralPath $vswhere) {
  $vsInstall = (& $vswhere -latest -products '*' -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 Microsoft.VisualStudio.Component.Windows11SDK.26100 -property installationPath 2>&1 | Out-String).Trim()
  Add-Check -Name 'MSVC and Windows SDK' -Passed (-not [string]::IsNullOrWhiteSpace($vsInstall)) -Required $true -Detail $(if ($vsInstall) { $vsInstall } else { 'required Visual Studio Build Tools components not found' })
} else {
  Add-Check -Name 'MSVC and Windows SDK' -Passed $false -Required $true -Detail 'Visual Studio Installer vswhere.exe not found'
}

if ($SkipRepositoryGates) {
  Add-Check -Name 'Repository gates' -Passed $false -Required $true -Detail 'Not run: -SkipRepositoryGates was supplied; this report cannot establish readiness'
} elseif (-not ($checks | Where-Object { $_.name -in @('Node.js 22.x', 'pnpm 10.15.1') -and -not $_.passed })) {
  Push-Location $repoRoot
  try {
    $gateCommands = @(
      [ordered]@{ name = 'Install frozen dependencies'; args = @('install', '--frozen-lockfile') },
      [ordered]@{ name = 'Generate API client'; args = @('client:generate') },
      [ordered]@{ name = 'Typecheck'; args = @('typecheck') },
      [ordered]@{ name = 'Tests'; args = @('test') },
      [ordered]@{ name = 'Contract drift'; args = @('contracts:check') },
      [ordered]@{ name = 'Dependency inventory drift'; args = @('deps:check') },
      [ordered]@{ name = 'Production build'; args = @('build') }
    )
    foreach ($gate in $gateCommands) {
      Invoke-NativeCheck -Name $gate.name -File 'pnpm' -Arguments $gate.args
    }
  } finally {
    Pop-Location
  }
} else {
  Add-Check -Name 'Repository gates' -Passed $false -Required $true -Detail 'Not run: required Node/pnpm versions are unavailable'
}

$requiredModel = 'Qwen/Qwen3.8-Flash-Next'
$configuredModel = [Environment]::GetEnvironmentVariable('OPENAI_COMPATIBLE_CHAT_MODEL')
$configuredDigest = [Environment]::GetEnvironmentVariable('OPENAI_COMPATIBLE_CHAT_MODEL_DIGEST')
Add-Check -Name 'Required generation model configured' -Passed ($configuredModel -eq $requiredModel) -Required $true -Detail $(if ($configuredModel) { $configuredModel } else { 'OPENAI_COMPATIBLE_CHAT_MODEL is unset' })
Add-Check -Name 'Generation model immutable digest' -Passed (-not [string]::IsNullOrWhiteSpace($configuredDigest)) -Required $true -Detail $(if ($configuredDigest) { $configuredDigest } else { 'OPENAI_COMPATIBLE_CHAT_MODEL_DIGEST is unset' })

$chatBaseUrl = [Environment]::GetEnvironmentVariable('OPENAI_COMPATIBLE_BASE_URL')
if ([string]::IsNullOrWhiteSpace($chatBaseUrl)) {
  Add-Check -Name 'Generation runtime model listing' -Passed $false -Required $true -Detail 'OPENAI_COMPATIBLE_BASE_URL is unset'
} elseif (-not (Test-LoopbackEndpoint $chatBaseUrl)) {
  Add-Check -Name 'Generation runtime model listing' -Passed $false -Required $true -Detail 'Endpoint must use HTTP with a numeric loopback address and no credentials, query or fragment'
} else {
  try {
    $headers = @{}
    $chatApiKey = [Environment]::GetEnvironmentVariable('OPENAI_COMPATIBLE_API_KEY')
    if (-not [string]::IsNullOrWhiteSpace($chatApiKey)) { $headers.Authorization = "Bearer $chatApiKey" }
    $modelsUri = "$($chatBaseUrl.TrimEnd('/'))/models"
    $models = Invoke-RestMethod -Method Get -Uri $modelsUri -Headers $headers -TimeoutSec 10 -MaximumRedirection 0
    $modelIds = @($models.data | ForEach-Object { $_.id })
    Add-Check -Name 'Generation runtime model listing' -Passed ($requiredModel -in $modelIds) -Required $true -Detail "endpoint=$modelsUri required-model-present=$($requiredModel -in $modelIds)"
  } catch {
    Add-Check -Name 'Generation runtime model listing' -Passed $false -Required $true -Detail 'Model listing failed; response content omitted from evidence'
  }
}

$ollamaBaseUrl = [Environment]::GetEnvironmentVariable('OLLAMA_BASE_URL')
if ([string]::IsNullOrWhiteSpace($ollamaBaseUrl)) { $ollamaBaseUrl = 'http://127.0.0.1:11434' }
try {
  if (-not (Test-LoopbackEndpoint $ollamaBaseUrl)) { throw 'Invalid loopback endpoint' }
  $ollamaTags = Invoke-RestMethod -Method Get -Uri "$($ollamaBaseUrl.TrimEnd('/'))/api/tags" -TimeoutSec 10 -MaximumRedirection 0
  $embeddingNames = @($ollamaTags.models | ForEach-Object { $_.name })
  Add-Check -Name 'Qwen embedding model installed' -Passed ('qwen3-embedding:0.6b' -in $embeddingNames) -Required $true -Detail "endpoint=$ollamaBaseUrl model=qwen3-embedding:0.6b"
} catch {
  Add-Check -Name 'Qwen embedding model installed' -Passed $false -Required $true -Detail 'Ollama listing failed or endpoint is not numeric HTTP loopback; response content omitted'
}

$report = [ordered]@{
  schema_version = 1
  run_id = $runId
  observed_at = (Get-Date).ToUniversalTime().ToString('o')
  computer_name = $env:COMPUTERNAME
  repository = $repoRoot
  host_doctor_evidence = $hostDoctorPath
  checks = $checks
  blockers = $blockers
  ready = ($blockers.Count -eq 0)
}

$json = $report | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText($reportPath, $json, [System.Text.UTF8Encoding]::new($false))
$json
Write-Host "Evidence: $reportPath"

if ($blockers.Count -gt 0) {
  Write-Error "RTX 4090 preflight has $($blockers.Count) blocker(s). See $reportPath"
  exit 1
}

Write-Host 'RTX 4090 preflight passed.'
