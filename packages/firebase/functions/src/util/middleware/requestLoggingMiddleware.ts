import { RequestHandler } from 'express';

export const requestLoggingMiddleware: RequestHandler = (req, res, next) => {
  logger.debug('New request received', {
    requestId: req.requestId,
    path: req.originalUrl,

    data: {

      body: req.body,
      query: req.query,
      params: req.params
    }
  });

  res.on('finish', () => {
    logger.debug('Request served', {
      statusCode: res.statusCode,
      requestId: req.requestId
    });
  });


  next();
};