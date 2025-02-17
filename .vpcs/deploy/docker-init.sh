#!/usr/bin/env bash
# Initial setup
install_log(){
  echo "[App Install] $1" 1>&2
  return 0
}

# Silent Install
silent_install(){
  install_log "Installing $1..."
  apk add --no-cache --quiet --update "$1" 2>/dev/null
  return 0
}

NODE_ENV='production'
export NODE_ENV
# Install initial packages
install_log "Installing initial packages..."
silent_install bash
silent_install coreutils
silent_install curl
silent_install libstdc++
silent_install procps
silent_install python3
silent_install openssl
silent_install openssh-client
silent_install sed
silent_install strace
silent_install wget
silent_install zip

# Detect hardware
install_log "Detecting hardware for node binary..."
Architecture="linux*"
OpenSSLArchitecture="linux*"
alpineArch="$(apk --print-arch)"
case "$alpineArch" in
  x86_64) Architecture='x64' OpenSSLArchitecture=linux-x64;;
  x86) OpenSSLArchitecture=linux-x64;;
  arm*) OpenSSLArchitecture=linux-arm64;;
  ppc6441e) OpenSSLArchitecture=linux-ppc641e;;
  s390x) OpenSSLArchitecture=linux-s390x;;
  *) OpenSSLArchitecture=linux-x64;;
esac
install_log "Detected architecture: $Architecture with SSL Arch: $OpenSSLArchitecture"

fetch_install_node(){
  NodeFile="node-v$NODE_VERSION-$OpenSSLArchitecture"
  NodeUrl="https://nodejs.org/dist/latest-v20.x/$NodeFile.tar.xz"
  echo "$NODE_VERSION" > /app/.node-version
  cd /tmp
  install_log "Downloading node binary from $NodeUrl..."
  curl -fsSL --compressed "$NodeUrl" -o "./$NodeFile.tar.xz"
  tar xvf ./"$NodeFile.tar.xz"
  mv "/app/tmp/$NodeFile/bin/*" /app/.vpcs/bin/
  chmod -R 755 /app/.vpcs/bin
  if test -f "/app/.vpcs/bin/node"; then install_log "Node binary installed!"; else install_log "Node binary not found!"; fi
  if test -z "$(npx --version 2>&1)"; then install_log "npx not found!"; else install_log "npx is installed!"; fi
  cd app
}

# Node user and group
install_log "Adding node user and group..."
addgroup -g 1000 node
adduser -u 1000 -G node -s /bin/bash -D node

# Install dependencies
install_log "Installing dependency packages..."
silent_install direnv
silent_install diffutils
silent_install file
silent_install gawk
silent_install gcompat
silent_install grep
silent_install jq
silent_install less
silent_install libpng-dev
silent_install lsof
silent_install netcat-openbsd
silent_install nodejs-current
silent_install npm
silent_install perl
silent_install ruby
silent_install strace
silent_install tcpdump
silent_install vim
silent_install wget
silent_install yq

# Set environment variables
install_log "Setting environment variables..."
GNUPGHOME="$(mktemp -d)" # Existing; see source img
SHELL="/bin/bash"
APP_ROOT="/app"
VPCS_ROOT="/app/.vpcs"
PATH="$PATH:/app/.vpcs/bin"
chmod -R 755 /app/.vpcs/bin
NODE_VERSION="$(node --version)"
NOERR="2>/dev/null"
export GNUPGHOME
export SHELL
export APP_ROOT
export VPCS_ROOT
export NODE_VERSION
export NOERR


# Check for node
install_log "Checking if node is installed..."
NodeFound="$(node -v $NOERR)"
install_log "Node Version: $NodeFound"



if test -z "$NodeFound" ; then
  install_log "Node not found! Installing manually..."
  fetch_install_node
else
  install_log "Node found!"
fi

# Install pnpm
install_log "Installing pnpm..."
if test -z "$(corepack -v $NOERR)"; then
  install_log "Corepack not found! Attempting install via alternate means..."
  if test ! -z "$(npm -v $NOERR)"; then
    install_log "Found NPM. Installing corepack.."
    npm install -g corepack
  else
    install_log "NPM not found! Installing corepack via script..."
    curl -fsSL https://corepack.github.io/install.sh | sh -
  fi
fi

if test -z "$(corepack -v $NOERR)" ; then
  install_log "Corepack not found! Attempting install pnpm via npm..."
  npm install -g @pnpm/exe
else
  install_log "Corepack is installed! Installing pnpm..."
  corepack enable
  corepack enable pnpm
  corepack prepare pnpm@latest --activate
fi

if test -z "$(pnpm -v $NOERR)"; then
  install_log "PNPM not found! Installing via script..."
  get.pnpm.io/install.sh | sh -
  export PNPM_HOME="/root/.local/share/pnpm"
  export PATH="$PATH:$PNPM_HOME:/app/.vpcs/bin"
  # apk gcompat adds glibc support so we can hopefully work with musl; otherwise:
  # bruteforce_glibc
else
  install_log "PNPM is installed!"
fi

# Attempt pnpm setup
pnpm setup
source /root/.bashrc
pnpm config set store-dir /app/.vpcs/usr/pnpm

# Nx setup
install_log "Using pnpm to install nx..."
pnpm add -g nx

# Node-fetch setup
install_log "Checking for node-fetch..."
if test -z "$(pnpm ls | grep 'fetch')" ; then
  install_log "Node-fetch not found! Installing..."
  pnpm add node-fetch
else
  install_log "Node-fetch is installed!"
fi

# VPCS Docker Environment
install_log "Configuring VPCS environment..."
cp /app/setup.sh /app/run.sh
chmod -R 755 /app/.vpcs/usr/profiles
chmod 755 /app/run.sh

# Install packages
install_log "Installing packages with pnpm..."
pnpm i


# Ensure vpcs works
install_log "Checking if VPCS is installed..."
if test -x "$(which vpcs)"; then install_log "VPCS not found!"; else install_log "VPCS is installed!"; fi


# Post-install script
install_log "Checking for post-install script..."
chmod -R 755 /app/.vpcs/deploy
chmod -R 755 /app/.vpcs/bin
VPCSWebService="$(vpcs getcfg .apps.webservice)"
if test -z "$VPCSWebService"; then
  install_log "No service defined! Skipping post-install script..."
  exit 0
else
  VPCSAppPath="$(realpath $(vpcs getcfg .services.$VPCSWebService.root))"
  echo "Checking for setup script at $VPCSAppPath/docker-setup.sh..."
  if test -x $VPCSAppPath/docker-setup.sh; then
    install_log "Running setup script..."
    $VPCSAppPath/docker-setup.sh
  else
    install_log "No setup script found! Skipping..."
  fi
fi


exit 0