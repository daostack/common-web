import express from 'express';

interface IRouteBasedMiddlewareOptions {
  /**
   * Only those routes will have the passed middleware
   */
  include?: string[],

  /**
   * Only those routes will not have the passed middleware
   */
  exclude?: string[],

  /**
   * Whether the middleware will be applied if both the include
   * amd exclude arrays are empty
   */
  applyByDefault?: boolean;
}

const defaultOptions: IRouteBasedMiddlewareOptions = {
  applyByDefault: true,
  exclude: [],
  include: []
};

export const routeBasedMiddleware = (middleware: express.RequestHandler, middlewareOptions: IRouteBasedMiddlewareOptions): express.RequestHandler => {
  const options = {
    ...defaultOptions,
    ...middlewareOptions
  };

  return (req, res, next) => {
    if (options.include?.length) {
      if (options.include.some(x => x === req.path)) {
        return middleware(req, res, next);
      } else {
        return next();
      }
    }

    if (options.exclude?.length) {
      if (options.exclude.some(x => x === req.path)) {
        return next();
      } else {
        return middleware(req, res, next);
      }
    }

    return options.applyByDefault
      ? middleware(req, res, next)
      : next();
  };
};