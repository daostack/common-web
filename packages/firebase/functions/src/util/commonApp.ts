import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import {
  authenticate,
  errorHandling,
  ipMiddleware,
  requestLoggingMiddleware,
  routeBasedMiddleware,
  sessions
} from './middleware';

export const commonRouter = express.Router;

interface ICommonAppOptions {
  unauthenticatedRoutes: string[]
}

export const commonApp = (router?: express.Router, options?: ICommonAppOptions): express.Application => {
  const app = express();

  app.use(sessions);
  app.use(ipMiddleware);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(express.json());

  app.use(express.urlencoded({
    extended: true
  }));

  app.use(requestLoggingMiddleware);

  app.use(cors({
    origin: true
  }));

  app.use(routeBasedMiddleware(authenticate, {
    exclude: options?.unauthenticatedRoutes || []
  }));

  if (router) {
    app.use(router);
  }

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
  });

  app.use(errorHandling);

  return app;
};