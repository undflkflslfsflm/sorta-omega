[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$FromRepository,
  [Parameter(Mandatory)][string]$ToRepository,
  [switch]$Apply
)

$ErrorActionPreference = 'Stop'
$source = (Resolve-Path -LiteralPath $FromRepository).Path.TrimEnd('\')
$target = (Resolve-Path -LiteralPath $ToRepository).Path.TrimEnd('\')
if ($source -eq $target) { throw 'Source and destination checkouts must differ.' }
$expectedScripts = [ordered]@{
  'Sorta Omega - InSchool timetable' = 'sync-inschool.ps1'
  'Sorta Omega - Teams assignments' = 'sync-teams-assignments.ps1'
  'Sorta Omega - Teams class posts' = 'sync-teams-channels.ps1'
}
foreach ($script in $expectedScripts.Values) {
  if (-not (Test-Path -LiteralPath (Join-Path $target "infra\windows-host\$script") -PathType Leaf)) { throw "The destination checkout is missing $script." }
}
$head = @(& git -C $target rev-parse HEAD)
if ($LASTEXITCODE -ne 0 -or $head.Count -ne 1 -or $head[0] -notmatch '^[0-9a-f]{40}$') { throw 'Destination checkout HEAD could not be verified.' }
$changes = @()
foreach ($entry in $expectedScripts.GetEnumerator()) {
  $task = Get-ScheduledTask -TaskName $entry.Key -ErrorAction Stop
  if ($task.State -eq 'Running') { throw "The task is running: $($entry.Key)" }
  if (@($task.Actions).Count -ne 1) { throw "Expected one action for $($entry.Key)" }
  $action = $task.Actions[0]
  if (-not $action.Execute.EndsWith('powershell.exe', [StringComparison]::OrdinalIgnoreCase)) { throw "Unexpected action executable for $($entry.Key)" }
  $expectedFile = Join-Path $source "infra\windows-host\$($entry.Value)"
  if (-not $action.Arguments.Contains("-File `"$expectedFile`"")) { throw "Unexpected script path for $($entry.Key)" }
  $occurrences = [regex]::Matches($action.Arguments, [regex]::Escape($source), [Text.RegularExpressions.RegexOptions]::IgnoreCase).Count
  if ($occurrences -ne 2) { throw "Expected exactly two source checkout references for $($entry.Key)" }
  $replacement = $action.Arguments.Replace($source, $target)
  if ($replacement -eq $action.Arguments -or $replacement.Contains($source)) { throw "Could not rewrite $($entry.Key) safely" }
  $changes += [pscustomobject]@{TaskName=$entry.Key; Script=$entry.Value; DestinationHead=$head[0]; OldAction=$action; NewArguments=$replacement}
}
if ($Apply) {
  foreach ($change in $changes) {
    $action = New-ScheduledTaskAction -Execute $change.OldAction.Execute -Argument $change.NewArguments
    Set-ScheduledTask -TaskName $change.TaskName -Action $action | Out-Null
    $after = Get-ScheduledTask -TaskName $change.TaskName
    if (@($after.Actions).Count -ne 1 -or $after.Actions[0].Arguments -ne $change.NewArguments) { throw "Task action verification failed for $($change.TaskName)" }
  }
}
$changes | Select-Object TaskName,Script,DestinationHead,@{Name='Applied';Expression={[bool]$Apply}} | ConvertTo-Json -Compress
