#- Installs PNPM
vpcs log info "Installing PNPM..."
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression


