# Digital Ocean

To use Digital Ocean as your staging cloud provider, as it allows us to build cloud-generic applications without
needing to use resources that are heavily cloud specific to a particular provider.

You can drastically simplify your digital ocean workfly by using the `doctl` command line tool. You can find documentation [here](https://docs.digitalocean.com/reference/doctl/how-to/install/).

## Getting Started

Install doctl -

* Mac: `brew install doctl`
* Linux: `snap install doctl`
* Windows:
```powershell
Invoke-WebRequest https://github.com/digitalocean/doctl/releases/download/v1.110.0/doctl-1.110.0-windows-amd64.zip -OutFile ~\doctl-1.110.0-windows-amd64.zip
Expand-Archive ~\doctl-1.110.0-windows-amd64.zip -DestinationPath ~
New-Item -ItemType Directory $env:ProgramFiles\doctl\
Move-Item -Path ~\doctl-1.110.0-windows-amd64\doctl.exe -Destination $env:ProgramFiles\doctl\
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path",
    [EnvironmentVariableTarget]::Machine) + ";$env:ProgramFiles\doctl\",
    [EnvironmentVariableTarget]::Machine)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine")
```


## Authentication

You can authenticate with Digital Ocean by creating a personal access token. You can create a token [here](https://cloud.digitalocean.com/account/api/tokens).

Now, you can auth with doctl by running `doctl auth init` and pasting your token. If you use other Digital Ocean contexts, you can use `doctl auth init --context myapp` to create a context for myapp, and switch to it with `doctl auth switch --context myapp`.

## Droplets

You can use doctl to ssh into a droplet with `doctl compute ssh <droplet-name>`.