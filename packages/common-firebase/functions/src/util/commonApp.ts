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

  // Add simple health check
  app.get('/health', (req, res) => {
    const health = {
      message: 'OK',
      healthy: true,
      uptime: process.uptime(),
      timestamp: Date.now()
    };

    try {
      res.status(200).send(health);
    } catch (e) {
      health.message = e.message;
      health.healthy = false;

      res.status(503).send();
    }
  })

  app.use(errorHandling);

  return app;
};