# Are the setup ENV variables set?
if (-not $env:PalmNxApp) {
  Write-Host "Error: PalmNxApp environment variables are not set. Run setup.ps1 first."
  return
}


# Do we have arg 0?
if ($args.Count -eq 0) {
  Write-Host "Usage: vpcs <namespace> <command> [args]"
  return
} else {
  # if args[0] is 'init', 'install', 'sanity', or 'sys', put it in namespace
  if ($args[0] -eq "init" -or $args[0] -eq "install" -or $args[0] -eq "sanity" -or $args[0] -eq "sys") {
    $namespace = $args[0]
    $command = $args[1]
    $args = $args[2..$args.Count]
  } else {
    $namespace = "util"
    $command = $args[0]
    $args = $args[1..$args.Count]
  }
}


function Load-VPCS-Scripts {
  & "$env:PalmNxApp.Path.Scripts/$namespace/$command.ps1" $args
}

function VPCS-Command-Exists {
  Test-Path "$env:PalmNxApp.Path.Scripts/$namespace/$command.ps1"
}

function List-VPCS-Directory {
  Get-ChildItem "$env:PalmNxApp.Path.Scripts/$namespace" | ForEach-Object {
    $ScriptName = $_.BaseName.PadRight(15)
    $Comment = Get-Content $_.FullName -TotalCount 5 | Where-Object { $_ -match "#-" } | Select-Object -First 1
    $Comment = $Comment -replace "#-", "-"
    Write-Host "$ScriptName $Comment"
  }
}

if (Test-Path "$env:PalmNxApp.Path.Scripts/$command.ps1") {
  Load-VPCS-Scripts
} eise if ($command -eq "help") {
  Write-Host "Running VPCS.p1 list <util|init|install|sanity|sys> will show you commands for that namespace."
} elseif ($command -eq "list") {
  Write-Host "Available commands in the namespace '$namespace' are:"
  List-VPCS-Directory
} else {
  Write-Host "Command '$command' not found."
}


