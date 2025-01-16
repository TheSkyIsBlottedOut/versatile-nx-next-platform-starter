# Versatile Nx/Next Platform Starter

## Description
This is a set of scripts meant to bootstrap express/nextjs applications quickly (hidden through use of direnv). This repository is the source of ideas I use later in my related repo [nosh](https://github.com/TheSkyIsblottedOut/nosh).
It is meant to start as a set of templates, scripts, and sanity checks, and meant to grow into a way to rapidly build and propagate platform features to people using the stack.


## What It Does

Most of the magic is obscured behind direnv; once you have this set properly (you will occasionally need to `direnv allow` until I decide to force-grant privileges) then everything is run from a vpcs task runner and a few configurations, including for docker codespaces; check the setup.sh for an idea of how this will eventually work in the guide.

Nx and NextJS are easy tools to start work with; this tool is designed to more simply control for proper configuration of Nx, NextJS, Docker, and configurations; this platform has been the source base for spinning up Nx-based repos and applications (Nx, NextJS, Express, etc) for dev teams to reduce the learning curve of technologies and to promote uniform logging, etc. features.

A version with shared js libraries (for injection into the apps) is complete but needs preparation for sharing; the ideas here are more mature in the nosh/bun repo, which trends towards bun/react and avoiding packages with known metrics/telemetry

## Toolkit

### vpcs
This is the primary script runner. It runs a few different kinds of scripts:

* init - this initializes some platform feature, like pnpm or nx workspaces.
* install - this installs required software for support, and of the correct version (usually).
* sanity - used internally to ensure that things exist before calling them. Some scripts run on /bin/sh until bash support is guaranteed.
* sys - does some system work, like finding your package manager
* util - does a lot of utilities.

Most calls are done via namespace and script name:

`vpcs init nx-workspace`

But util scripts will be the default namespace, if a script exists, ergo:

`vpcs log error "Failure"`

Most other scripts in the core bin folder don't belong there, but there is a locate script to tell you where things *should* be:

`locate`
Finds framework-relative files and directories.


## Toolkit

### vpcs

This is the primary script runner. It runs a few different kinds of scripts:

* init - this initializes some platform feature, like pnpm or nx workspaces.
* install - this installs required software for support, and of the correct version (usually).
* sanity - used internally to ensure that things exist before calling them. Some scripts run on /bin/sh until bash support is guaranteed.
* sys - does some system work, like finding your package manager
* util - does a lot of utilities.

Most calls are done via namespace and script name:

`vpcs init nx-workspace`

But util scripts will be the default namespace, if a script exists, ergo:

`vpcs log error "Failure"`


## VPCS Command Summary

Command                        | Effect
-------------------------------|-----------------------------
`ji <emoji> <content> `        | Echoes a logline to STDERR with an emoji.
`locate <resource> `           | Finds parts of the VPCS filesystem.
`shabash`                      | Ensures / enforces bash presence.
`vpcs switch <app>`            | Modifies vpcs.yml to update webservice and framework.
`vpcs update-vpcs <branch>`    | Version checks .vpcs folder vs another branch, and commits an update if the other branch is newer.
`vpcs dev`                     | Runs devmode (nextjs) or service (node)
`vpcs getcfg .key1.key2`       | Shortcut for `cat $APP_ROOT/vpcs.yml | yq .key1.key2`
`vpcs list`                    | Shows commands
`vpcs log info "logme"`        | Logs content at the specified loglevel.
`vpcs log-level <switch> <level>` | Sets log level for switch (--console or --log).
`vpcs nudge`                   | After modifying .vpcs or setup.sh, use this to set the version to YYYY.MM.DD in the internal vpcs template
`vpcs nx2vpcs`                 | Updates vpcs.yml to match nx project configs.
`vpcs nxconf <project> [jsonfile] [jq commands]` | Updates a project.json file for NextJS with targets for VPCS (mostly serve)
`vpcs refresh-webconfigs`      | Writes webconfigs to @vpcs/serverconfigs sourcedir.
`vpcs version`                 | Prints current VPCS version.

### VPCS System Commands

Command                                     | Effect
--------------------------------------------|-----------------------------------------
`vpcs sys build-library <library>`          | Runs the 'build' target for the project; designed for package redistribution
`vpcs sys chmod-bindir`                     | 755's the .vpcs/bin directories
`vpcs sys git-update`                       | Writes current git sha / version info to the configs.
`vpcs sys githook <hookname> "..." `        | Adds the content to the specified git hook
`vpcs sys setenv <environment>`             | Updates the environment (copying dockerfiles from the .vpcs/etc dir). Needs update.
`vpcs sys installer [pkg1] [pkg2]...`       | Finds common installers and installs packages.


### VPCS Sanity Checks

These are mostly called by other scripts.

Command                                     | Checks/Installs
--------------------------------------------|-----------------------------------------
`vpcs sanity bash-shell`                    | bash
`vpcs sanity cfg-calls [yq command] `       | checks structure of a yq call
`vpcs sanity direnv-cfg`                    | Ensures direnv is configured/installed.
`vpcs sanity dir-structure`                 | Rebuilds internal directories
`vpcs sanity envcheck`                      | Checks environment setup
`vpcs sanity git-repo`                      | Shows git repo name
`vpcs sanity node-basics`                   | node / npm
`vpcs sanity json-mgr`                      | jq
`vpcs sanity nx-workspace`                  | Installs nx and makes sure the root workspace is nx.
`vpcs sanity node-version-reqs`             | Checks that node version is as defined in the project.
`vpcs sanity ostype`                        | Detects current OS (currently, alpine or mac)
`vpcs sanity pnpm-pkg`                      | Ensures pnpm is set up properly
`vpcs sanity yaml-mgr`                      | yq
`vpcs sanity homebrew`                      | (Mac only) installs homebrew.

### VPCS Installers

Command                                     | Checks/Installs
--------------------------------------------|-----------------------------------------
`vpcs install latest-nx`                    | Updates nx.
`vpcs install package [packagename] `       | Tries to install the package using the detected installer.
`vpcs install pnpm-libs "lib1"`             | Runs pnpm add.
`vpcs install ruby`                         | Installs ruby.
`vpcs install markdown-cli`                 | Installs a mrkdown client.
`vpcs install code-fonts`                   | Installs (?) a set of monospaced fonts
`vpcs install docker-node`                  | The dockerfile install script called by an alpine docker install

### VPCS Initializers

Command                                     | Checks/Installs
--------------------------------------------|-----------------------------------------
`vpcs init env-profile [name] [content]`    | Creates an extension profile loaded by direnv at terminal.
`vpcs init fastify-app [name]`              | Adds a fastify app.
`vpcs init next-app [name]`                 | Adds a nextjs app.
`vpcs init framework-libs [framework] <name>`      | Generates libraries using the nx generator for a variety of frameworks
`vpcs init nx-vpcs-bridge`                  | Part of setting up the nx workspace; builds the nx workspace / vpcs connectors.
`vpcs init vpcs-library`                    | Creates a generic library under the @vpcs/ namespace.
`vpcs init nx-workspace`                    | Initializes NX in the git repo root.


