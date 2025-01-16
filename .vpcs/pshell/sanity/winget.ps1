#- Check if winget is installed
$IsInstalled = Get-Command winget -ErrorAction SilentlyContinue
if (-not $IsInstalled) {
  Write-Host "Error: winget is not installed. Installing..."
  vpcs install winget
}
exit 0