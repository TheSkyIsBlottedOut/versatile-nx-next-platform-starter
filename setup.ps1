# Direnv doesn't work, so we will just manually set default environment Variables
# $env:NxApp = @{
#   "Path" = @{
#     "Root" = $PsScriptRoot
#     "VPCS" = "$PsScriptRoot\.vpcs"
#     "Scripts" = "$PsScriptRoot\.vpcs\pshell"
#     "Temp" = "$PsScriptRoot\.vpcs\temp"
#     "Exe" = "$PsScriptRoot\.vpcs\pshell\sys"
#   }
#   "LogLevel" = @{
#     "Console" = "chatty"
#     "File" = "info"
#   }
# }
# $Path += ";$($env:PalmNxApp.Path.Exe);$($env:PalmNxApp.Path.Scripts)"

# Directly set each environment variable
$env:NxAppRoot = $PsScriptRoot
$env:NxAppVPCS = "$PsScriptRoot\.vpcs"
$env:NxAppScripts = "$PsScriptRoot\.vpcs\pshell"
$env:NxAppTemp = "$PsScriptRoot\.vpcs\temp"
$env:NxAppExe = "$PsScriptRoot\.vpcs\pshell\sys"

$env:NxAppLogLevelConsole = "chatty"
$env:NxAppLogLevelFile = "info"

# Update the PATH environment variable
$env:Path += ";$($env:NxAppExe);$($env:NxAppScripts)"

# Can we run the vpcs.ps1 script from the current directory now?
if (-not (Get-Command vpcs.ps1 -ErrorAction SilentlyContinue)) {
  Write-Host "Error: Could not find the vpcs.ps1 script in the current directory."
  return
}

Write-Host "Run vpcs commands in PowerShell! Try typing 'vpcs list' to get started."
exit 0