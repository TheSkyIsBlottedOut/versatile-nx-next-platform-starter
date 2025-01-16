#!/usr/bin/env bash
# Sets up the application originally.
cd $(dirname "$0")
[[ ! -f ./.envrc ]] && cp ./.vpcs/etc/template/envrc/default.env ./.envrc
source ./.envrc

vpcs sanity direnv-cfg
if [[ ! -f $APP_ROOT/.vpcs/usr/profiles/logger.profile ]]; then
  vpcs log-level --console chatty
  vpcs log-level --logs info
else
  vpcs log info "Setup script refuses to reset log level; use vpcs log-level to set your ideal chatter level"
fi

vpcs log info "Log levels set. Checking environment..."
vpcs sanity envcheck # everything eventually goes here

if [[ ! -f $APP_ROOT/env/environment.profile ]]; then
  vpcs sys setenv development
fi

if [[ ! -f $APP_ROOT/nx.json ]]; then
  vpcs init nx-workspace
else
  vpcs log info "Refusing to re-init nx workspace. Delete local nx.json if this is a mistake."
fi
if [[ -z "$(direnv --version 2>/dev/null)" ]]; then
  echo "Direnv not installed after sanity check. Attempting to force install."
  vpcs install package direnv
fi
if [[ -z "$(direnv 2>/dev/null)" ]]; then
  echo "Installer doesn't appear to be enjoying this. I may have to overwrite cd myself; hwoever, until then, please manually install (see direnv.net). Note that if you source .envrc you should still be functional (you may need to rm all the files in .env/*)"
fi

if [[ ! -z "$(git branch --show-current 2>/dev/null)" ]]; then
  vpcs sys githook --once pre-commit "vpcs sys git-update"
  vpcs sys git-update
  cp .vpcs/etc/template/post-checkout .git/hooks/post-checkout # now it'll just do it whenever so there
fi
direnv allow
vpcs log info "You've been set up with a workspace! Try vpcs list to see commands, or vpcs init next-app [name] to jump right in"
exit 0
