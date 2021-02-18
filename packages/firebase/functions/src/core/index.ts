import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { auth } from 'firebase-admin';
import { ApolloServer } from 'apollo-server-express';

import { schema } from './graph';
import { sessions, ipMiddleware } from '../util/middleware';


export interface IRequestContext {
  request: {
    id: string;
    ip: string;
  }
  getUserId: () => Promise<string>
}

const app = express();
const apollo = new ApolloServer({
  schema,
  context: ({ req }): IRequestContext => ({
    request: {
      id: req.requestId,
      ip: req.ipAddress
    },

    getUserId: async () => {
      return (await auth().verifyIdToken(req.headers.authorization)).uid;
    }
  })
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(sessions);
app.use(ipMiddleware);

apollo.applyMiddleware({ app });

export const graphApp = app;