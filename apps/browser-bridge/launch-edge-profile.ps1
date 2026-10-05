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
  $portText = (Get-Content -LiteralPath $portFile -TotalCount 1).Trim()
  if ($portText -match '^\d{4,5}$' -and [int]$portText -ge 1024 -and [int]$portText -le 65535) {
    try {
      $response = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$portText/json/version" -TimeoutSec 2
      if ([int]$response.StatusCode -eq 200) {
        Write-Output 'Omega Edge automation profile is already running.'
        return
      }
    } catch {
      # A stale port file is normal after Edge closes; start the profile below.
    }
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
