#- install ruby with winget

# ensure winget
vpcs sanity winget
vpcs log info "Installing Ruby..."
winget install RubyInstallerTeam.RubyWithDevKit.3.2 --location $env:NxApp.Path.Exe\ruby