import express from 'express';
import cors from 'cors';

import { ApolloServer } from 'apollo-server-express';

import { FirebaseToolkit } from '@toolkits';
import { schema, createRequestContext } from '@graph';

// Initialize the firebase admin app
FirebaseToolkit.InitializeFirebase();

// Initialize the servers
const app = express();
const apollo = new ApolloServer({
  schema,
  context: createRequestContext
});


// Configure the express app
app.use(cors());

// Add the Apollo middleware to the express app
apollo.applyMiddleware({ app });

// Temporally request logger
app.use((req, res, next) => {
  console.debug('New request', req);

  return next();
});

app.listen({ port: 4000 }, () => {
  console.info(`🚀 Server ready`);
});