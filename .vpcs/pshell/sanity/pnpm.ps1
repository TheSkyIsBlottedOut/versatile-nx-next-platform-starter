#- ensures that pnpm is installed
$IsInstalled = Get-Command pnpm -ErrorAction SilentlyContinue
if (-not $IsInstalled) {
  Write-Host "Error: pnpm is not installed. Installing..."
  vpcs install pnpm
}