param(
  [Parameter(Mandatory = $true)]
  [string]$LauncherPath
)

$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $LauncherPath -PathType Leaf)) {
  throw 'The Omega Edge launcher is missing.'
}
$desktop = [Environment]::GetFolderPath('Desktop')
if (-not $desktop -or -not (Test-Path -LiteralPath $desktop -PathType Container)) {
  throw 'The current user desktop is unavailable.'
}
$shortcutPath = Join-Path $desktop 'Sorta Omega - Connect school accounts.lnk'
if (Test-Path -LiteralPath $shortcutPath) {
  Write-Output 'Omega account shortcut already exists; it was not overwritten.'
  return
}
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = Join-Path $PSHOME 'powershell.exe'
$shortcut.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + $LauncherPath + '"'
$shortcut.WorkingDirectory = Split-Path -Parent $LauncherPath
$shortcut.Description = 'Open the dedicated Omega Edge profile for Teams and InSchool sign-in.'
$shortcut.Save()
Write-Output 'Omega account shortcut created on the current user desktop.'
