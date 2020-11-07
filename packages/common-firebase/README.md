# The backend code, powering Common

This repository contains code for the firebase backend of the project.

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