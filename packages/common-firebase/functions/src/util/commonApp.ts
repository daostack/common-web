import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

export const commonApp = (): express.Application => {
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

  return app;
};