import { ApolloServer } from 'apollo-server-express';

import ipAddress from 'request-ip';
import express from 'express';
import cors from 'cors';

import { schema } from './schema';
import { createRequestContext } from './context';


// Initialize the servers
const app = express();
const apollo = new ApolloServer({
  schema,
  context: createRequestContext
});


// Configure the express app
app.use(cors());
app.use(ipAddress.mw());


// Add the Apollo middleware to the express app
apollo.applyMiddleware({ app });

app.listen({ port: 4050 }, () => {
  console.info(`🚀 Server ready`);
});