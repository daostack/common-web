
module.exports = new class CommonError extends Error {
  constructor(errorCode, errorMsg) {
    super(errorMsg);
    this.name = this.constructor.name;
    this.errorCode = errorCode
    Error.captureStackTrace(this, this.constructor);
  }
}

// const Error = Object.freeze({
//   invalidIdToken: {
//     errorCode: 'U-001',
//     errorMsg: 'Invaild id token'
//   },
//   emptyUserData: {
//     errorCode: 'U-002',
//     errorMsg: 'Empty data find by uid',
//   }
// })
