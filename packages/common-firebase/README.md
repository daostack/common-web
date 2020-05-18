
# Secrets

To run these functions, you will need some secrets in ./functions/_keys.
Please ask the administrators for these keys.

## Running the Cloud functions

To run the firebase functions for the api you can run the following commands to:

### Locally
Run a local instance (this will not run a pubsub function):
```
firebase emulators:start --only functions
```

### Deploy
To deploy the firebase functions run:
```
firebase deploy --only functions
```

### Pubsub functions
To run a pubsub function you will need to have firebase-tools installed, run
```
npm i -g firebase-tools
```
Then run the following command to create a shell
```
firebase functions:shell
```
Then run the scheduledFunction() which in our case is our pubsub function
```
firebase > scheduledFunction()
```
