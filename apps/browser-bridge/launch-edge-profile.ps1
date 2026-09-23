param(
  [string]$InSchoolOrigin = 'https://mailand.inschool.visma.no'
)

$ErrorActionPreference = 'Stop'
$origin = [Uri]$InSchoolOrigin
if ($origin.Scheme -ne 'https' -or -not $origin.Host.EndsWith('.inschool.visma.no')) {
  throw 'A registered HTTPS InSchool origin is required.'
}

$edgeCandidates = @(
  [IO.Path]::Combine(${env:ProgramFiles(x86)}, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
  [IO.Path]::Combine($env:ProgramFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe')
)
$edge = $edgeCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $edge) { throw 'Microsoft Edge is not installed.' }
if (-not $env:LOCALAPPDATA) { throw 'LOCALAPPDATA is unavailable.' }

$profile = Join-Path $env:LOCALAPPDATA 'SortaOmega\BrowserBridge\EdgeUserData'
New-Item -ItemType Directory -Force -Path $profile | Out-Null
$portFile = Join-Path $profile 'DevToolsActivePort'
if (Test-Path -LiteralPath $portFile) {
  $port = [int](Get-Content -LiteralPath $portFile -TotalCount 1)
  $listener = Get-NetTCPConnection -LocalAddress '127.0.0.1' -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  if ($listener) {
    Write-Output 'Omega Edge automation profile already appears to be running.'
    return
  }
}

$arguments = @(
  "--user-data-dir=`"$profile`"",
  '--remote-debugging-port=0',
  '--remote-debugging-address=127.0.0.1',
  '--no-first-run',
  '--no-default-browser-check',
  'https://teams.microsoft.com/',
  $origin.GetLeftPart([UriPartial]::Authority)
)
Start-Process -FilePath $edge -ArgumentList $arguments -WindowStyle Normal
Write-Output 'Omega Edge profile opened. Sign in to Teams and InSchool in the new Edge window; Brave remains untouched.'
