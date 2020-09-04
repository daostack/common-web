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
  "moduleNameMapper": {
    "^@root(.*)$": "<rootDir>/$1",
    "^@env(.*)$": "<rootDir>/functions/env/$1",
    "^@util(.*)$": "<rootDir>/functions/util/$1",
    "^@functions(.*)$": "<rootDir>/functions/$1",
    "^@helpers(.*)$": "<rootDir>/__tests__/helpers/$1",
  }
};