
# Firebase code in support for common

This repository contains code for the clodufunctions and the website hosting, and some scripts to manage the code.

# firestore

To run the script, you need to install gcloud and 

For ios:
```curl https://sdk.cloud.google.com | bash```

# hosting 
# functions

## Running the Cloud functions

To run the firebase functions for the api you can run the following commands to:

### Locally
Run a local instance (this will not run a pubsub function):
```
firebase emulators:start --only functions
```
Note that this these cloud functions will operate on the production instance if started like that.

### Deploy

To deploy these functions, you will need some secrets in ./functions/_keys.
Please ask the administrators for these keys.

```
firebase deploy --only functions
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

### Top up the relayer
To top up the relayer send xDAI or rinkeby to this address ```0x86FC3E21B2897641BCa28404e06f37E9157E12b3```


## API endpoints

There are API endpoint for testing the functionality of the application. They are:

1. For testing the email sending functionality
   
   **Endpoint** `/tests/sendEmail
   
   **Query Parameters**
   
    - **To (required)** - the email address of the test mail receiver
    - **Subject (optional)** - optional subject for the test email
    - **Message (optional)** - optional message for the test email

