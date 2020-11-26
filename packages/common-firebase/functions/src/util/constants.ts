export const StatusCodes = {
  InternalServerError: 500,

  NotFound: 404,

  Ok: 200
};

export const ErrorCodes = {
  NotFound: 'NotFound',

  GenericError: 'GenericError',
  UncaughtError: 'UncaughtError',

  // ---- External providers errors
  CirclePayError: 'External.CirclePayError'
};

export const Collections = {
  Subscriptions: 'subscriptions',
  Proposals: 'proposals',
  Payments: 'payments',
  Commons: 'daos',
  Event: 'event',
  Cards: 'cards'
};

export const runtimeOptions = {
  timeoutSeconds: 540
};