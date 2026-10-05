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
function Test-ProfileReady {
  if (-not (Test-Path -LiteralPath $portFile)) { return $false }
  $portText = (Get-Content -LiteralPath $portFile -TotalCount 1).Trim()
  if ($portText -notmatch '^\d{4,5}$' -or [int]$portText -lt 1024 -or [int]$portText -gt 65535) { return $false }
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$portText/json/version" -TimeoutSec 2
    return [int]$response.StatusCode -eq 200
  } catch {
    return $false
  }
}

function Test-ProfileProcess {
  $escapedProfile = [regex]::Escape($profile)
  $process = Get-CimInstance Win32_Process -Filter "Name = 'msedge.exe'" |
    Where-Object { $_.CommandLine -match $escapedProfile } |
    Select-Object -First 1
  return $null -ne $process
}

# Scheduled school imports may all start at once. Keep the readiness check and
# launch inside one cross-process lock so only one of them opens the tabs.
$launchMutex = [System.Threading.Mutex]::new($false, 'Local\SortaOmegaSchoolEdgeLaunch')
$ownsMutex = $false
try {
  try {
    $ownsMutex = $launchMutex.WaitOne([TimeSpan]::FromSeconds(30))
  } catch [System.Threading.AbandonedMutexException] {
    $ownsMutex = $true
  }
  if (-not $ownsMutex) { throw 'Timed out waiting for the school Edge launcher.' }

  if (Test-ProfileReady) {
    Write-Output 'Omega Edge automation profile is already running; no tabs opened.'
    return
  }

  # Edge may still be starting, or its debugging endpoint may be temporarily
  # unavailable. Never send URLs to that existing profile: Edge would turn
  # every attempted "relaunch" into another pair of tabs.
  if (Test-ProfileProcess) {
    for ($attempt = 0; $attempt -lt 10; $attempt++) {
      Start-Sleep -Seconds 1
      if (Test-ProfileReady) {
        Write-Output 'Omega Edge automation profile is already running; no tabs opened.'
        return
      }
    }
    throw 'Omega Edge is running, but its automation endpoint is unavailable. No tabs were opened.'
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
  for ($attempt = 0; $attempt -lt 15; $attempt++) {
    Start-Sleep -Seconds 1
    if (Test-ProfileReady) {
      Write-Output 'Omega Edge profile opened. Sign in to Teams and InSchool in that Edge window; Brave remains untouched.'
      return
    }
  }
  throw 'Omega Edge was started, but its automation endpoint did not become ready. No additional tabs were opened.'
} finally {
  if ($ownsMutex) { $launchMutex.ReleaseMutex() }
  $launchMutex.Dispose()
}
