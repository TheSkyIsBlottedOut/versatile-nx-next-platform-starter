#- Check that nx is installed
$IsInstalled = Get-Command nx -ErrorAction SilentlyContinue
vpcs sanity pnpm
pnpm add -g nx

# Ensure app root in windows is an nx workspace
if (-not (Test-Path "$env:PalmNxApp.Path.Root\nx.json")) {
  cd $env:PalmNxApp.Path.Root
  $AppName = Get-Content $env:PalmNxApp.Path.Root\package.json | ConvertFrom-Json | Select-Object -ExpandProperty name
  if ($AppName -eq $null) {
    # Use folder name as app name
    $AppName = (Get-Item $env:PalmNxApp.Path.Root).Name
  }
  nx new --preset=empty --appName=$AppName --style=scss --linter=eslint --nx-cloud=false --skipInstall=true
  exit 0
}