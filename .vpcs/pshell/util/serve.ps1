#- serve the existing webservice
function serve {
  # Get config for apps.webservice
  $WebserviceConfig = vpcs getcfg apps.webservice
  $Framework = vpcs getcfg apps.framework

  if ($WebserviceConfig -eq $null) {
    Write-Host "Error: Could not find config for apps.webservice in vpcs.yml."
    return
  }

  if ($Framework -eq $null) {
    Write-Host "Error: Could not find config for apps.framework in vpcs.yml."
    return
  }
  $Port = vpcs getcfg apps.webservice.port
  if ($Port -eq $null) {
    $Port = 3000
  }
  pnpm exec nx run $WebserviceConfig:dev --verbose $args -- --port $Port
}
serve $args