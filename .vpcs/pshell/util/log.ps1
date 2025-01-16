#- vpcs log <level> [message] - Logs a message based on loglevel.

$LogLevels = @("chatty" "debug" "info" "warning" "error" "critical")
if ($args[0] -in $LogLevels) {
  $Level = $args[0]
  $Message = $args[1..$args.Count] -join " "
} else {
  $Level = "info"
  $Message = $args -join " "
}
$EmojiPrefixes = @{
  "chatty" = "🗣️"
  "debug" = "🐛"
  "info" = "ℹ️"
  "warning" = "⚠️"
  "error" = "❌"
  "critical" = "🚨"
}

# if level is lower than the Console LogLevel, don't Write-Host
if ($env:PalmNxApp.LogLevel.Console -in $LogLevels) {
  $ConsoleLevel = $env:PalmNxApp.LogLevel.Console
  $ConsoleLevelIndex = [array]::IndexOf($LogLevels, $ConsoleLevel)
  $LevelIndex = [array]::IndexOf($LogLevels, $Level)
  if ($LevelIndex -ge $ConsoleLevelIndex) {
    Write-Host "$($EmojiPrefixes[$Level]) $Message"
  }
}

# if level is lower than the File LogLevel, don't Write-Output;
# otherwise, make sure there's a file called vpcs.log in App Root \logs\vpcs.log
if ($env:PalmNxApp.LogLevel.File -in $LogLevels) {
  $FileLevel = $env:PalmNxApp.LogLevel.File
  $FileLevelIndex = [array]::IndexOf($LogLevels, $FileLevel)
  $LevelIndex = [array]::IndexOf($LogLevels, $Level)
  if ($LevelIndex -ge $FileLevelIndex) {
    $LogPath = "$env:PalmNxApp.Path.Root\logs\vpcs.log"
    $LogLine = "$(Get-Date -Format "yyyy-MM-dd HH:mm:ss") [$Level] $Message"
    $LogLine | Out-File -FilePath $LogPath -Append
  }
}
# Exit quietly
exit 0