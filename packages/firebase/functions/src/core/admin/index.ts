import { ApolloServer } from 'apollo-server-express';
import { schema } from './adminSchema';
import { commonApp } from '../../util';
import * as functions from 'firebase-functions';
import { runtimeOptions } from '../../constants';


export const server = new ApolloServer({
  schema
});

const app = commonApp(null, {
  unauthenticatedRoutes: [
    '/graphql'
  ]
});

server.applyMiddleware({
  app
});

export const adminApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(app);