module.exports = {
  testMatch: [
    '**/?(*.)+(spec|test).ts'
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: [
    'json-summary',
    'text',
    'lcov'
  ],
  moduleNameMapper: {
    '^@functions(.*)$': "<rootDir>/functions/src/$1"
  }
};