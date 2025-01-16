#!/usr/bin/env bash
# Initial setup

apt-get install -y python3 curl ruby-full
export NODE_ENV=production
export PYTHON=$(which python3)
export PORT=8080
exit 0