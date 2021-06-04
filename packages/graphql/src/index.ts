import { ApolloServer } from 'apollo-server-express';

import * as HTTP from 'http';

import ipAddress from 'request-ip';
import express from 'express';
import cors from 'cors';

import { logger } from '@common/core';

import { schema } from './schema';
import { createRequestContext } from './context';


// Initialize the servers
const app = express();
const http = HTTP.createServer(app);
const apollo = new ApolloServer({
  schema,
  context: createRequestContext,


  subscriptions: {
    // path: '/graphql'
  }
});

// Configure the express app
app.use(cors());
app.use(ipAddress.mw());


// Add the Apollo middleware to the express app
apollo.applyMiddleware({ app });
apollo.installSubscriptionHandlers(http);

http.listen({ port: 4000 }, () => {
  logger.info(`🚀 Server ready`);
});