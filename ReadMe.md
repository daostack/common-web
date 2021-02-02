<!--suppress HtmlDeprecatedAttribute -->

<p align="center">
  <img alt="Common Logo" src="/docs/img/logo.png">
</p>

<p align="center">
  The monorepo containg the code behind <a href="https://common.io">Common</a>
</p>

<p align="center">
  <img alt="CloudFunctions Tests Badge" src="https://github.com/daostack/common-monorepo/workflows/Firebase%20CloudFunctions%20Test%20CI/badge.svg" />
</p>

### Getting Started

To get started with development for the project you should have `Node 12 LTS` installed on your machine. 
If you plan to run the CloudFunctions you should also have Java SDK installed. The next think you need to do is to 
install lerna globally. To do so you should run `yarn global add lerna` in any location. Afterwards simple `yarn boot`

### Documentation

- General Commands
    - [`exec`](/docs/commands/general-commands.md#exec)
    - [`clean`](/docs/commands/general-commands.md#clean)
    - [`typecheck`](/docs/commands/general-commands.md#typecheck)


- Firebase Commands
    - [`firebase:dev`](/docs/commands/firebase-commands.md#dev)
    - [`firebase:start`](/docs/commands/firebase-commands.md#start)
    - [`firebase:compile`](/docs/commands/firebase-commands.md#compile)
    - [`firebase:compile:watch`](/docs/commands/firebase-commands.md#compile:watch)
    - *`Internal: firebase:ci:setup`*
    - *`Internal: firebase:ci:test`*
    

- Typings Commands
    - [`types:compile`](/docs/commands/typings-commands.md)
    - [`types:compile:watch`](/docs/commands/typings-commands.md)
    

- Hooks Commands (Internal, not for use)
    - `hooks:precommit`