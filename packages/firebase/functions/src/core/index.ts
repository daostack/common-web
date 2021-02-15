import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';

import { schema } from './graph';

const app = express();
const apollo = new ApolloServer({
  schema
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

apollo.applyMiddleware({ app });

export const graphApp = app;