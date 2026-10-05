[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [switch]$Apply
)

# Inspect without -Apply. Applying changes only the active scheme's AC idle
# sleep and hibernation timeouts; the previous values are saved under ProgramData.
# This cannot power on a shut-down PC or restore service after a power outage.

$ErrorActionPreference = 'Stop'

function Invoke-PowerCfg([string[]]$Arguments) {
  $result = @(& powercfg.exe @Arguments 2>&1)
  if ($LASTEXITCODE -ne 0) { throw "powercfg $($Arguments -join ' ') failed: $($result -join ' ')" }
  return $result
}

$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]::new($identity)
if ($Apply -and -not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  throw 'Run this script in an elevated PowerShell on the always-on Windows host.'
}

$scheme = @(Invoke-PowerCfg -Arguments @('/getactivescheme')) -join "`n"
$standbyBefore = @(Invoke-PowerCfg -Arguments @('/query', 'SCHEME_CURRENT', 'SUB_SLEEP', 'STANDBYIDLE')) -join "`n"
$hibernateBefore = @(Invoke-PowerCfg -Arguments @('/query', 'SCHEME_CURRENT', 'SUB_SLEEP', 'HIBERNATEIDLE')) -join "`n"
$backupPath = $null

if ($Apply -and $PSCmdlet.ShouldProcess('current Windows power scheme', 'Disable AC idle sleep and AC idle hibernation')) {
  $backupDirectory = Join-Path $env:ProgramData 'SortaOmega\power-policy'
  New-Item -ItemType Directory -Path $backupDirectory -Force | Out-Null
  $backupPath = Join-Path $backupDirectory ('before-' + (Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ') + '.txt')
  [IO.File]::WriteAllText($backupPath, "Active scheme:`n$scheme`n`nAC standby before:`n$standbyBefore`n`nAC hibernation before:`n$hibernateBefore`n", [Text.UTF8Encoding]::new($false))

  Invoke-PowerCfg -Arguments @('/change', 'standby-timeout-ac', '0') | Out-Null
  Invoke-PowerCfg -Arguments @('/change', 'hibernate-timeout-ac', '0') | Out-Null
}

$standbyAfter = @(Invoke-PowerCfg -Arguments @('/query', 'SCHEME_CURRENT', 'SUB_SLEEP', 'STANDBYIDLE')) -join "`n"
$hibernateAfter = @(Invoke-PowerCfg -Arguments @('/query', 'SCHEME_CURRENT', 'SUB_SLEEP', 'HIBERNATEIDLE')) -join "`n"
[pscustomobject]@{
  ComputerName = $env:COMPUTERNAME
  Applied = [bool]($Apply -and $backupPath)
  BackupPath = $backupPath
  ActiveScheme = $scheme
  AcStandbySetting = $standbyAfter
  AcHibernateSetting = $hibernateAfter
  DcSettingsChanged = $false
  DisplaySettingChanged = $false
}
