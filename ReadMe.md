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

## Documentation

The backend consist of multiple parts:

* `Core` - In this package is all the logic of the app
* `GraphQL` - In this package is all the user facing GraphQL API. The authentication and authorization should also be
  handled here as they are not one of `core`'s concerns
* `Worker` - This package contains the background jobs of the project
<<<<<<< HEAD

### Setting up the project


* Node - v14.17.0
* Postgres - PostgreSQL 13.2
* Redis - Redis server v=6.2.3

Then you need to install all the dependencies in the project. To do that you need to run `yarn bootstrap`. This will
install all the dependencies and link them accordingly.

After you get all your things installed you need to get a hold of the env file. Example can be found
[here](.env.example). When the .env is placed in the project root you need to run `yarn env:update` to propagate the env
file in all the packages that need it.

When the .env files are placed correctly you need to sync the database with the latest migrations. To do so you need to
run `yarn db:setup` and wait for it to finish.

And with that the project is set up.

### Running the project

The backend has two entry points: `graphql` and `worker`. They both depend on the third package: `core`, so to run
either of them the first package. To compile any project you need to run `yarn compile` in that project folder. If you
wish to compile all projects you can also run `yarn compile:backend` in the root of the project.

To run the `graphql` project you have two options:

* `yarn start` - To run in normally, without reloading. This is mostly for production
* `yarn dev` - To hotreload it on changes. This only transpiles the changes, perfect for fast development

The same applies to the `worker` project

## Guides

[**Authorization Guide**](/docs/guides/authorization.md) - How and where to handle the authorization
=======

#### Setting up the project

