# Project Structure

This project is an Nx monorepo
which supports multiple generated applications, shared libraries,
and components. The following hierarchy from the git root
(pointed to by the APP_ROOT environment variable) shows
the structure of the project:

| Path               | Description                                      |
|--------------------|--------------------------------------------------|
| apps               | Contains the applications in the monorepo.       |
| .bundle            | The ruby configuration for  bundler support. |
| .github            | GitHub actions and workflows.                    |
| .nx                | Nx configuration files, cache, and terminal logs.  |
| .vpcs              | The build system managing the monorepo (see the [VPCS](project://alexandria/overview/vpcs.md) reference). |
| alexandria         | Documentation for the projects and for copilot to use. |
| bundle             | The ruby self-installed gems for bundler support. |
| libs/cnx           | Incomplete libraries for connection adapters. |
| libs/middleware    | Shared middleware libraries. |
| libs/multiframe    | Shared libraries to handle different Request/Response types. |
| libs/ux            | Shared libraries for user experience. |
| libs/vpcs/core     | Core libraries for the shared apps. |
| libs/vpcs/core/app-logging | Client/server browser metrics libraries. |
| libs/vpcs/core/goodmode | JS Class overrides (extensions to make JS more like smalltalk or ruby). |
| libs/vpcs/core/nextjsconfig | Configuration for the current application. |
| libs/vpcs/core/scherzo | A bin namespace for vpcs extensions. All vpcs libraries with a src/bin dir can be triggered by `vpcs [library] [bin]`. |
| libs/vpcs/core/tk | Another bin namespace: `vpcs tk [bin]`. |
| libs/vpcs/deprecated | Libraries with valuable code that is no longer in use. |
| logs               | Log files for the project. All apps should log to their own named logfiles if using the centralized logger include. |
| node_modules       | Node modules for the project. |
| secrets            | Secrets for the project. Stored in submodules; `vpcs refresh-webconfigs` puts these into the nextjsconfig library. |
| setup.sh        | The VPCS doctor script; tries to enable vpcs command and adds a .envrc file for direnv. |
| vpcs.yml        | The global configuration for all projects. Defines the existing (primary) application target run by vpcs, NX configurations, and feature configs. |

Since nextjsconfig gets its information from both the vpcs.yml and secrets submodule, the vpcs.yml file
is organized with a few global settings, and then features by project.
For instance:

.apps.language - js or ts; defines what language vpcs will use in nx generators.
.apps.framework - the framework of the current project.
.apps.monorepo - the project name of the entire monorepo.
.apps.webservice - the name of the webservice for the current project (the target for `vpcs dev`, `vpcs build`, `vpcs serve`, `vpcs lint`, etc.)
.node.version - the version of node to use for the project.
.git.sha - the current git sha for the project. Updated via webhook.
.vpcs.version - the version of vpcs; running `vpcs update-vpcs [branch]` will auto update if the version of the target branch is newer. `vpcs nudge` will bump the version of the current branch.
