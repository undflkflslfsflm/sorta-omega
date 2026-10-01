[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^(?:\d{1,3}\.){3}\d{1,3}$')]
    [string]$AllowedRemoteAddress
)

$ErrorActionPreference = 'Stop'

$principal = [Security.Principal.WindowsPrincipal]::new([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw 'Run this script from an elevated PowerShell window on the SSH host.'
}

$parsedAddress = $null
if (-not [Net.IPAddress]::TryParse($AllowedRemoteAddress, [ref]$parsedAddress) -or
    $parsedAddress.AddressFamily -ne [Net.Sockets.AddressFamily]::InterNetwork) {
    throw 'AllowedRemoteAddress must be one exact IPv4 address.'
}
$octets = $parsedAddress.GetAddressBytes()
if ($octets[0] -ne 100 -or $octets[1] -lt 64 -or $octets[1] -gt 127) {
    throw 'AllowedRemoteAddress must be one Tailscale CGNAT IPv4 address (100.64.0.0/10).'
}

$adapter = Get-NetAdapter -ErrorAction Stop |
    Where-Object { $_.Name -like '*Tailscale*' -or $_.InterfaceDescription -like '*Tailscale*' } |
    Select-Object -First 1
if (-not $adapter) { throw 'No Tailscale adapter was found.' }
if ((Get-Service -Name sshd -ErrorAction Stop).Status -ne 'Running') {
    throw 'Windows OpenSSH Server is not running.'
}
$defaultRule = Get-NetFirewallRule -Name 'OpenSSH-Server-In-TCP' -ErrorAction SilentlyContinue
if ($defaultRule -and $defaultRule.Enabled -eq 'True') {
    throw 'The broad Windows OpenSSH rule is enabled; disable it before changing the scoped Tailscale rule.'
}

$ruleName = 'Sorta-Scoped-SSH-Tailscale'
$rule = Get-NetFirewallRule -Name $ruleName -ErrorAction SilentlyContinue
if ($rule) {
    $port = $rule | Get-NetFirewallPortFilter
    if ($port.Protocol -ne 'TCP' -or $port.LocalPort -ne '22') {
        throw "Existing $ruleName rule is not TCP port 22; review it manually."
    }
    if ($PSCmdlet.ShouldProcess($ruleName, "Scope SSH to $AllowedRemoteAddress on $($adapter.Name)")) {
        $rule | Set-NetFirewallRule -Enabled True -Direction Inbound -Action Allow -Profile Any | Out-Null
        $rule | Get-NetFirewallAddressFilter | Set-NetFirewallAddressFilter -RemoteAddress $AllowedRemoteAddress | Out-Null
        $rule | Get-NetFirewallInterfaceFilter | Set-NetFirewallInterfaceFilter -InterfaceAlias $adapter.Name | Out-Null
    }
} elseif ($PSCmdlet.ShouldProcess("TCP 22 from $AllowedRemoteAddress on $($adapter.Name)", 'Create scoped Tailscale SSH allow rule')) {
    New-NetFirewallRule -Name $ruleName -DisplayName 'Sorta scoped SSH from trusted Tailscale client' `
        -Enabled True -Direction Inbound -Action Allow -Protocol TCP -LocalPort 22 `
        -RemoteAddress $AllowedRemoteAddress -InterfaceAlias $adapter.Name -Profile Any | Out-Null
}

$blockName = 'Sorta-Block-SSH-Tailscale'
$block = Get-NetFirewallRule -Name $blockName -ErrorAction SilentlyContinue
if ($block -and $PSCmdlet.ShouldProcess($blockName, 'Disable blanket Tailscale SSH block after creating scoped allow rule')) {
    $block | Disable-NetFirewallRule | Out-Null
}

[pscustomobject]@{
    Hostname = $env:COMPUTERNAME
    TailscaleInterface = $adapter.Name
    AllowedRemoteAddress = $AllowedRemoteAddress
    ScopedAllowEnabled = (Get-NetFirewallRule -Name $ruleName -ErrorAction SilentlyContinue).Enabled
    BlanketTailscaleBlockEnabled = if ($block) { (Get-NetFirewallRule -Name $blockName).Enabled } else { 'Absent' }
    BroadOpenSshRuleEnabled = if ($defaultRule) { $defaultRule.Enabled } else { 'Absent' }
    SshService = (Get-Service -Name sshd).Status
}
