
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
```

### Top up the relayer
To top up the relayer send xDAI or rinkeby to this address ```0x86FC3E21B2897641BCa28404e06f37E9157E12b3```


## API endpoints

