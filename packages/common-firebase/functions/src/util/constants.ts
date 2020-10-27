export const StatusCodes = {
  InternalServerError: 500,

  NotFound: 404,

  Ok: 200
}

export const ErrorCodes = {
  NotFound: 'NotFound',

  GenericError: 'GenericError',
  UncaughtError: 'UncaughtError',

  // ---- External providers errors
  CirclePayError: 'External.CirclePayError'
}