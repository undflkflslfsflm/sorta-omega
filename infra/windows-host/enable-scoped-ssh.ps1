[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^ssh-ed25519 [A-Za-z0-9+/]+={0,3}(?: .*)?$')]
    [string]$AuthorizedPublicKey,

    [Parameter(Mandatory = $true)]
    [ValidatePattern('^(?:\d{1,3}\.){3}\d{1,3}$')]
    [string]$AllowedRemoteAddress
)

$ErrorActionPreference = 'Stop'

$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]::new($identity)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw 'Run this script from an elevated PowerShell window on the SSH host.'
}

$parsedAddress = $null
if (-not [Net.IPAddress]::TryParse($AllowedRemoteAddress, [ref]$parsedAddress) -or
    $parsedAddress.AddressFamily -ne [Net.Sockets.AddressFamily]::InterNetwork) {
    throw 'AllowedRemoteAddress must be one exact IPv4 address.'
}

$capability = Get-WindowsCapability -Online -Name 'OpenSSH.Server~~~~0.0.1.0'
if ($capability.State -ne 'Installed') {
    if ($PSCmdlet.ShouldProcess('Windows OpenSSH Server', 'Install capability')) {
        Add-WindowsCapability -Online -Name 'OpenSSH.Server~~~~0.0.1.0' | Out-Null
    }
}

$user = [Security.Principal.WindowsIdentity]::GetCurrent().Name
$isAdministrator = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if ($isAdministrator) {
    $authorizedKeys = Join-Path $env:ProgramData 'ssh\administrators_authorized_keys'
} else {
    $sshDirectory = Join-Path $env:USERPROFILE '.ssh'
    New-Item -ItemType Directory -Path $sshDirectory -Force | Out-Null
    $authorizedKeys = Join-Path $sshDirectory 'authorized_keys'
}

$existingKeys = if (Test-Path -LiteralPath $authorizedKeys) {
    @(Get-Content -LiteralPath $authorizedKeys | Where-Object { $_.Trim() })
} else { @() }
$keyMaterial = (($AuthorizedPublicKey -split '\s+')[0..1] -join ' ')
$alreadyPresent = $existingKeys | Where-Object { (($_ -split '\s+')[0..1] -join ' ') -eq $keyMaterial }
if (-not $alreadyPresent -and $PSCmdlet.ShouldProcess($authorizedKeys, "Authorize key for $user")) {
    $parent = Split-Path -Parent $authorizedKeys
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
    Add-Content -LiteralPath $authorizedKeys -Value $AuthorizedPublicKey -Encoding ascii
}

if ($isAdministrator -and (Test-Path -LiteralPath $authorizedKeys)) {
    & icacls.exe $authorizedKeys /inheritance:r /grant 'SYSTEM:F' /grant 'Administrators:F' | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Could not secure administrators_authorized_keys ACLs.' }
}

$defaultRule = Get-NetFirewallRule -Name 'OpenSSH-Server-In-TCP' -ErrorAction SilentlyContinue
if ($defaultRule) {
    Disable-NetFirewallRule -Name 'OpenSSH-Server-In-TCP' | Out-Null
}
$ruleName = 'Sorta-Scoped-SSH-In-TCP'
$scopedRule = Get-NetFirewallRule -Name $ruleName -ErrorAction SilentlyContinue
if ($scopedRule) {
    Set-NetFirewallRule -Name $ruleName -Enabled True -Direction Inbound -Action Allow -Profile Any | Out-Null
    $scopedRule | Get-NetFirewallAddressFilter | Set-NetFirewallAddressFilter -RemoteAddress $AllowedRemoteAddress | Out-Null
} elseif ($PSCmdlet.ShouldProcess("TCP 22 from $AllowedRemoteAddress", 'Create scoped firewall rule')) {
    New-NetFirewallRule -Name $ruleName -DisplayName 'Sorta scoped SSH' -Enabled True -Direction Inbound -Action Allow -Protocol TCP -LocalPort 22 -RemoteAddress $AllowedRemoteAddress -Profile Any | Out-Null
}

Set-Service -Name sshd -StartupType Automatic
Start-Service -Name sshd

$fingerprintFile = [IO.Path]::GetTempFileName()
try {
    Set-Content -LiteralPath $fingerprintFile -Value $AuthorizedPublicKey -Encoding ascii
    $fingerprint = & ssh-keygen.exe -lf $fingerprintFile
} finally {
    Remove-Item -LiteralPath $fingerprintFile -Force -ErrorAction SilentlyContinue
}
$hostKeyFingerprints = @(Get-ChildItem -LiteralPath (Join-Path $env:ProgramData 'ssh') -Filter 'ssh_host_*_key.pub' -File | ForEach-Object {
    & ssh-keygen.exe -lf $_.FullName
})

[pscustomobject]@{
    Hostname = $env:COMPUTERNAME
    User = $env:USERNAME
    Service = (Get-Service sshd).Status
    AuthorizedKeys = $authorizedKeys
    AllowedRemoteAddress = $AllowedRemoteAddress
    PublicKeyFingerprint = $fingerprint
    HostKeyFingerprints = $hostKeyFingerprints
    DefaultBroadFirewallRuleDisabled = [bool]$defaultRule
}
