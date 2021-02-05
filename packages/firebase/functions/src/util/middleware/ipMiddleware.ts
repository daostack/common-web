import { RequestHandler } from 'express';

export const ipMiddleware: RequestHandler = (req, res, next) => {
  const forwardedFor = (req.headers['x-forwarded-for'] as string)?.split(',')[0];
  const userIp = req.headers['x-appengine-user-ip'] as string;

  req.ipAddress = userIp || forwardedFor || '127.0.0.1';

  if (req.ipAddress === '127.0.0.1') {
    logger.warn('Cannot parse the IP address for request', { headers: req.headers });
  }

  next();
};