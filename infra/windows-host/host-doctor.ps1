[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

function Get-CommandProbe([string]$Name) {
  $resolved = Get-Command -Name $Name -ErrorAction SilentlyContinue
  if (-not $resolved) {
    return [ordered]@{ available = $false; path = $null; version = $null }
  }
  $version = $null
  try {
    $version = (& $resolved.Source --version 2>$null | Select-Object -First 1) -join ''
  } catch {
    $version = 'available; version probe failed'
  }
  return [ordered]@{ available = $true; path = $resolved.Source; version = $version }
}

$report = [ordered]@{
  observed_at = (Get-Date).ToUniversalTime().ToString('o')
  computer_name = $env:COMPUTERNAME
  operating_system = $null
  cpu = $null
  memory_gb = $null
  gpu = @()
  disks = @()
  commands = [ordered]@{}
  services = @()
  notes = @()
}

try {
  $os = Get-CimInstance -ClassName Win32_OperatingSystem
  $report.operating_system = [ordered]@{ caption = $os.Caption; version = $os.Version; architecture = $os.OSArchitecture }
} catch { $report.notes += "Operating-system probe failed: $($_.Exception.Message)" }

try {
  $cpu = Get-CimInstance -ClassName Win32_Processor | Select-Object -First 1
  $report.cpu = [ordered]@{ name = $cpu.Name; cores = $cpu.NumberOfCores; logical_processors = $cpu.NumberOfLogicalProcessors }
} catch { $report.notes += "CPU probe failed: $($_.Exception.Message)" }

try {
  $system = Get-CimInstance -ClassName Win32_ComputerSystem
  $report.memory_gb = [math]::Round($system.TotalPhysicalMemory / 1GB, 1)
} catch { $report.notes += "Memory probe failed: $($_.Exception.Message)" }

try {
  $report.gpu = @(Get-CimInstance -ClassName Win32_VideoController | ForEach-Object {
    [ordered]@{ name = $_.Name; adapter_memory_gb = [math]::Round($_.AdapterRAM / 1GB, 1); driver_version = $_.DriverVersion }
  })
} catch { $report.notes += "GPU probe failed: $($_.Exception.Message)" }

try {
  $report.disks = @(Get-Volume | Where-Object DriveLetter | ForEach-Object {
    [ordered]@{ drive = $_.DriveLetter; filesystem = $_.FileSystem; free_gb = [math]::Round($_.SizeRemaining / 1GB, 1); size_gb = [math]::Round($_.Size / 1GB, 1) }
  })
} catch { $report.notes += "Disk probe failed: $($_.Exception.Message)" }

foreach ($commandName in @('docker', 'podman', 'psql', 'ollama', 'tailscale', 'cloudflared', 'node', 'pnpm', 'wsl')) {
  $report.commands[$commandName] = Get-CommandProbe -Name $commandName
}

try {
  $report.services = @(Get-Service -Name 'Tailscale','docker','postgresql*','Ollama*' -ErrorAction SilentlyContinue | ForEach-Object {
    [ordered]@{ name = $_.Name; status = $_.Status.ToString(); start_type = $_.StartType.ToString() }
  })
} catch { $report.notes += "Service probe failed: $($_.Exception.Message)" }

$report | ConvertTo-Json -Depth 8
