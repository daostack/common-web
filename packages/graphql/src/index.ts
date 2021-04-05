export { schema } from './schema';
export { createRequestContext } from './context';

import ipAddress from 'request-ip';
import express from 'express';
import cors from 'cors';

import { router } from 'bull-board';
import { ApolloServer } from 'apollo-server-express';

import { schema, createRequestContext } from '../../graphql/src';

import '@config';


// Initialize the servers
const app = express();
const apollo = new ApolloServer({
  schema,
  context: createRequestContext
});


// Configure the express app
app.use(cors());
app.use(ipAddress.mw());

app.use('/queues/dashboard', router);

// Add the Apollo middleware to the express app
apollo.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
  console.info(`🚀 Server ready`);
});