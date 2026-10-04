param(
  [Parameter(Mandatory = $true)][ValidatePattern('^[a-z0-9-]{3,40}$')][string]$DeviceKey,
  [Parameter(Mandatory = $true)][string]$OutputDirectory,
  [switch]$InventoryOnly
)
$ErrorActionPreference = 'Stop'
if (-not [System.IO.Path]::IsPathRooted($OutputDirectory)) { throw 'Use a new absolute staging directory.' }
$output = [System.IO.Path]::GetFullPath($OutputDirectory)
if (Test-Path -LiteralPath $output) { throw 'Use a new absolute staging directory.' }
$profileRoot = [Environment]::GetFolderPath('UserProfile')
if (-not $output.StartsWith([System.IO.Path]::Combine($profileRoot, 'AppData', 'Local', 'SortaOmega', 'Imports') + [System.IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Staging must remain in the owner-private SortaOmega Imports directory.' }
$allowed = @('.pdf', '.docx', '.pptx', '.xlsx', '.txt', '.md', '.csv', '.eml', '.html', '.htm')
$roots = @(
  [pscustomobject]@{ Label = 'Documents'; Path = [System.IO.Path]::Combine($profileRoot, 'Documents') },
  [pscustomobject]@{ Label = 'Desktop'; Path = [System.IO.Path]::Combine($profileRoot, 'Desktop') },
  [pscustomobject]@{ Label = 'Downloads'; Path = [System.IO.Path]::Combine($profileRoot, 'Downloads') }
)
Get-ChildItem -LiteralPath $profileRoot -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like 'OneDrive*' } | ForEach-Object { $roots += [pscustomobject]@{ Label = $_.Name; Path = $_.FullName } }
if (-not $InventoryOnly) { New-Item -ItemType Directory -Path (Join-Path $output 'files') -Force | Out-Null }
$items = [System.Collections.Generic.List[object]]::new()
$skipped = [System.Collections.Generic.List[object]]::new()
$inventory = @{}
foreach ($root in $roots) {
  if (-not (Test-Path -LiteralPath $root.Path)) { continue }
  $pending = [System.Collections.Generic.Stack[string]]::new()
  $visited = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
  $pending.Push($root.Path)
  while ($pending.Count -gt 0) {
  $directory = $pending.Pop()
  if (-not $visited.Add($directory)) { continue }
  Get-ChildItem -LiteralPath $directory -Directory -ErrorAction SilentlyContinue | Where-Object { -not ($_.Attributes -band [IO.FileAttributes]::ReparsePoint) -and $_.FullName -notmatch '\\(\.git|node_modules|Codex|\.codex|\.venv|venv|site-packages|vendor|dist|build|target|out)($|\\)|\\ChatGPT\\(calendar app|homelab)($|\\)' } | ForEach-Object { $pending.Push($_.FullName) }
  Get-ChildItem -LiteralPath $directory -File -ErrorAction SilentlyContinue | ForEach-Object {
    $file = $_
    $relative = $file.FullName.Substring($root.Path.TrimEnd('\').Length + 1)
    $display = "$($root.Label)/$($relative.Replace('\', '/'))"
    if ($file.FullName -match '\\(\.git|node_modules|Codex|\.codex)\\|\\ChatGPT\\(calendar app|homelab)\\') { return }
    if ($file.Name -match '(?i)(\.env|secret|credential|private.?key|recovery.?code|password|token)') { $skipped.Add([pscustomobject]@{ Path = $display; Reason = 'sensitive_name' }); return }
    if ($allowed -notcontains $file.Extension.ToLowerInvariant()) { return }
    if ($file.Length -gt 25MB) { $skipped.Add([pscustomobject]@{ Path = $display; Reason = 'over_25_mb' }); return }
    if ($InventoryOnly) {
      $folder = ($relative -split '\\')[0]
      $key = "$($root.Label)/$folder"
      if (-not $inventory.ContainsKey($key)) { $inventory[$key] = [pscustomobject]@{ Folder = $key; Files = 0; Bytes = [long]0 } }
      $inventory[$key].Files++
      $inventory[$key].Bytes += $file.Length
      return
    }
    try {
      $hash = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
      $staged = Join-Path $output "files/$hash"
      if (-not (Test-Path -LiteralPath $staged)) { Copy-Item -LiteralPath $file.FullName -Destination $staged -ErrorAction Stop }
      if ((Get-FileHash -LiteralPath $staged -Algorithm SHA256).Hash.ToLowerInvariant() -ne $hash) { throw 'staged_checksum_mismatch' }
      $items.Add([pscustomobject]@{ relativePath = $display; stagedName = $hash; sha256 = $hash; byteLength = $file.Length; modifiedAt = $file.LastWriteTimeUtc.ToString('o') })
    } catch { $skipped.Add([pscustomobject]@{ Path = $display; Reason = 'unreadable_or_staging_failed' }) }
  }
  }
}
if ($InventoryOnly) { $inventory.Values | Sort-Object -Property Files -Descending | Select-Object -First 30; return }
$manifest = [ordered]@{ version = 'omega_personal_files_v1'; deviceKey = $DeviceKey; stagedAt = [DateTime]::UtcNow.ToString('o'); items = @($items); skipped = @($skipped) }
$manifest | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $output 'manifest.json') -Encoding utf8
[pscustomobject]@{ DeviceKey = $DeviceKey; Files = $items.Count; Skipped = $skipped.Count; StagedBytes = ($items | Measure-Object -Property byteLength -Sum).Sum; OutputDirectory = $output }
