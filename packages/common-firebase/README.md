# The backend code, powering Common

This repository contains code for the firebase backend of the project.

# Documentation

To see the endpoint documentation you can click [here](https://documenter.getpostman.com/view/5095300/TVemAUcq)


# Quick start for developers

- clone the repository
- get the secrets: https://daostack1.atlassian.net/wiki/spaces/CMN/pages/45711371/SECRETS+needed+for+common-firebase
- yarn
- yarn build # compile the typescript code into javascript, alternative, yarn build:watch will run a watcher

To run the functions locally but connect to the staging database in the cloud:

- yarn use:staging # connect to the staging backed in the cloud, yarn use:production will connect to the prodcution backend
- yarn serve # run the functions locally, and connect to the backend

To run both db adn functions locally:
- mkdir firestore/data
- yarn use:staging
- yarn data:update # download the dta from staging database
- yarn emulator # run the whole suite locally

# Local environment

To run everything locally you could use the following command:

`yarn start`

For more information you could check [here](https://github.com/daostack/common-firebase/blob/dev/doc/local.md)

# firestore

To run the script, you need to install gcloud and 

For ios:
```curl https://sdk.cloud.google.com | bash```

# hosting 
# functions

## Running the Cloud functions

To run the firebase functions for the api you can run the following commands to:

### Locally


**1. Set the environment which you want to start locally.**\
  (at this point we are using the **staging** env while testing/develop locally)

- `yarn use:local`  - prepare the project to start on local environment
- `yarn use:staging`  - prepare the project to start on staging environment
- `yarn use:production`  - prepare the project to start on production environment

**2. Backup staging database on local project.**

-  `yarn data:backup`  - Execute in order to store locally the current database stage from the environment that you use.
-  `yarn data:update`  - Execute every time when you want to sync your local database with the databse on the current environment.

**3. Start firebase emulator with local clouldfunctions and firestore. The firestore will be loaded with the latest backup version which you have locally.**

-  `yarn dev` - starts all services - 1) http clould functions 2) stub functions 3) local firestore
-  `yarn emulator:functions` - starts only http clould functions - 1) http clould functions

Note that this these cloud functions will operate on the production instance if started like that.

### Deploy

To deploy these functions, you will need some secrets in ./functions/_keys.
Please ask the administrators for these keys.


```
yarn deploy:staging
yarn deploy:production
```

### Development
To run a pubsub function you will need to have firebase-tools installed, run
```
npm i -g firebase-tools
```
Then run the following command to create a shell
```
firebase functions:shell
```
you can then call the API functions

```
graphql.graphql.get('update-daos')
graphql.graphql.get('update-proposals')
graphql.graphql.get('update-proposal-by-id')
```