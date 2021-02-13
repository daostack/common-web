import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import express from 'express';

import { schema } from './graph';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const apollo = new ApolloServer({
  schema
});

apollo.applyMiddleware({app});

export const graphApp = app;