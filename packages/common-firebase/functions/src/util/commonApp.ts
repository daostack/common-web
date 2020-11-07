import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import { authenticate, errorHandling } from './middleware';

export const commonRouter = express.Router;

export const commonApp = (router: express.Router): express.Application => {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(express.json());

  app.use(express.urlencoded({
    extended: true
  }));

  app.use(cors({
    origin: true
  }));

  app.use(authenticate);

  app.use(router);

  app.use(errorHandling);

  return app;
};