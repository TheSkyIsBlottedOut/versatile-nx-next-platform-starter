#- vpcs sanity ruby - runs ruby -v to check if ruby is installed
$IsInstalled = Get-Command ruby -ErrorAction SilentlyContinue
if (-not $IsInstalled) {
  Write-Host "Error: Ruby is not installed. Installing..."
  vpcs install ruby
}