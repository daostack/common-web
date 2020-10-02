const { v4: uuidv4 } = require('uuid');

class CommonError extends Error {
  constructor(
    message,
    userMessage = 'Something bad happened',
    statusCode = 500
  ) {
    super(message);

    this.errorId = uuidv4();
    this.name = this.constructor.name;

    this.userMessage = userMessage;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CommonError;