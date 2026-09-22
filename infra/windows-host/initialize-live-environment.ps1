[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$WorkspaceRoot,

  [ValidatePattern('^https?://')]
  [string]$AppOrigin = 'http://127.0.0.1:3210',

  [switch]$Force
)

$ErrorActionPreference = 'Stop'
$workspace = (Resolve-Path -LiteralPath $WorkspaceRoot).Path
$templatePath = Join-Path $workspace '.env.example'
$environmentPath = Join-Path $workspace '.env'

if (-not (Test-Path -LiteralPath $templatePath -PathType Leaf)) {
  throw "Missing environment template: $templatePath"
}

if ((Test-Path -LiteralPath $environmentPath) -and -not $Force) {
  throw "Refusing to replace existing environment file: $environmentPath. Pass -Force only after preserving the current secrets."
}

function New-RandomHex([int]$ByteCount) {
  $bytes = [byte[]]::new($ByteCount)
  $generator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  try { $generator.GetBytes($bytes) } finally { $generator.Dispose() }
  return ([BitConverter]::ToString($bytes) -replace '-', '').ToLowerInvariant()
}

function New-RandomBase64Url([int]$ByteCount) {
  $bytes = [byte[]]::new($ByteCount)
  $generator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  try { $generator.GetBytes($bytes) } finally { $generator.Dispose() }
  return [Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
}

$values = [ordered]@{
  DATABASE_URL = 'postgres://sorta:unused-compose-only@127.0.0.1:5432/sorta_omega'
  API_HOST = '127.0.0.1'
  API_PORT = '3210'
  APP_ORIGIN = $AppOrigin.TrimEnd('/')
  OAUTH_CREDENTIAL_KEY_HEX = New-RandomHex 32
  BACKUP_ENCRYPTION_KEY_HEX = New-RandomHex 32
  OMEGA_WORKSPACE_ROOT = $workspace
  BOOTSTRAP_SECRET = New-RandomBase64Url 48
  POSTGRES_PASSWORD = New-RandomHex 32
  NODE_ENV = 'production'
}

$lines = foreach ($line in Get-Content -LiteralPath $templatePath) {
  if ($line -match '^([A-Z][A-Z0-9_]*)=') {
    $name = $Matches[1]
    if ($values.Contains($name)) {
      "$name=$($values[$name])"
      continue
    }
  }
  $line
}

[System.IO.File]::WriteAllLines($environmentPath, $lines, [System.Text.UTF8Encoding]::new($false))

$identity = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
& icacls.exe $environmentPath '/inheritance:r' '/grant:r' "${identity}:(F)" 'SYSTEM:(F)' | Out-Null
if ($LASTEXITCODE -ne 0) {
  throw "Failed to restrict access to $environmentPath"
}

$acl = Get-Acl -LiteralPath $environmentPath
$unexpectedAllow = @($acl.Access | Where-Object {
  $_.AccessControlType -eq 'Allow' -and
  $_.IdentityReference.Value -notin @($identity, 'NT AUTHORITY\SYSTEM')
})
if ($unexpectedAllow.Count -gt 0) {
  throw "Environment ACL contains an unexpected allowed identity. Review $environmentPath locally."
}

[pscustomobject]@{
  environment_file = $environmentPath
  app_origin = $values.APP_ORIGIN
  owner = $identity
  inherited_acl = $acl.AreAccessRulesProtected -eq $false
  secret_values_printed = $false
}
