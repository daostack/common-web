# The backend code, powering Common

This repository contains code for the firebase backend of the project.

# Quick start for developers

- clone the repository
- get the secrets: https://daostack1.atlassian.net/wiki/spaces/CMN/pages/45711371/SECRETS+needed+for+common-firebase
- yarn
- yarn build # compile the typescript code into javascript, alternative, yarn build:watch will run a watcher

To run the functions locally but connect to the staging database in the cloud:

- yarn use:staging # connect to the staging backed in the cloud, yarn use:production will connect to the prodcution backend
- yarn serve # run the functions locally, and connect to the backend

To run both db and functions locally:
- mkdir firestore/data
- yarn use:staging
- yarn data:update # download the dta from staging database
- yarn emulator # run the whole suite locally

# Local environment

To run everything locally you could use the following command:

`yarn start`

# Cloud Functions

To run the firebase functions for the api you can run the following commands to:

**1. Set the environment which you want to start locally.**\
  (at this point we are using the **staging** env while testing/develop locally)

- `yarn use:local`  - prepare the project to start on local environment
- `yarn use:staging`  - prepare the project to start on staging environment
- `yarn use:production`  - prepare the project to start on production environment

**2. Backup staging database on local project.**

-  `yarn data:backup`  - Execute in order to store locally the current database stage from the environment that you use.
-  `yarn data:update`  - Execute every time when you want to sync your local database with the database on the current environment.

**3. Start firebase emulator with local cloud functions and firestore. The firestore will be loaded with the latest backup version which you have locally.**

-  `yarn dev` - starts all services - 1) http cloud functions 2) stub functions 3) local firestore
-  `yarn emulator:functions` - starts only http cloud functions - 1) http cloud functions

Note that this these cloud functions will operate on the production instance if started like that.

### Deploy

To deploy these functions, you will need some secrets in ./functions/_keys.
Please ask the administrators for these keys.

```
yarn deploy:staging
yarn deploy:production
```

### Development

#### Authentication

Most (if not all) of the http functions are placed behind the authentication layer. This can be 
annoying for development especially taking into consideration the one-hour period in which the authentication token is 
valid. Because of that there is a way to 'bypass' the authentication layer by either running command that uses the development
authentication by default or by placing `cross-env NODE_ENV=dev` before the command you want to run with the development auth.
After that the only thing you need to do is provide token in the `Authorization` header of the following format:

```
{ uid: {{userId}} }
```

Here `{{userId}}` is the ID of the user you want to authenticate with.


#### Testing

Each of the cloud functions should have extensive test suites written for them. For that we are using 
[Jest](https://jestjs.io/docs/en/getting-started). All tests are placed under the __tests__ folder and should end
with either `.spec.ts` or `.test.ts`. The commands for running the tests are:

`yarn test` - Just runs the tests once without setting up the firebase emulator.
`yarn test:watch` - Just runs the tests on every file change, but without setting up any firebase emulators

`yarn test:emulator` - Bad name, cool command. It first setups the firebase emulators and then runs the tests on top 
of it. This command is mainly used by the GitHub Actions CI.
