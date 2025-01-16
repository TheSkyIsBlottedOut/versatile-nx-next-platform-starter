#- Install WinGet
$progressPreference = 'silentlyContinue'
Write-Information "Downloading WinGet and its dependencies..."
$URL = "https://api.github.com/repos/microsoft/winget-cli/releases/latest"
$JsonPath = (Invoke-WebRequest -Uri $URL).Content -OutFile $env:PalmNxApp.Path.Temp\winget.json
$WingetURL = Get-Content $JsonPath | ConvertFrom-Json |
  Select-Object -ExpandProperty "assets" |
  Where-Object "browser_download_url" -Match '.msixbundle' |
  Select-Object -ExpandProperty "browser_download_url"

Invoke-WebRequest -Uri $WingetURL -OutFile "$env:PalmNxApp.Path.Temp\winget.msixbundle" -UseBasicParsing
Add-AppxPackage -Path "$env:PalmNxApp.Path.Temp\winget.msixbundle" -ForceApplicationShutdown
Remove-Item "$env:PalmNxApp.Path.Temp\winget.json"
Remove-Item "$env:PalmNxApp.Path.Temp\winget.msixbundle"

