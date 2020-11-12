module.exports = {
  testMatch: [
    // '**/?(*.)+(spec|test).ts',
    '**/proposal.test.ts'
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
    "^@env(.*)$": "<rootDir>/functions/src/env/$1",
    "^@util(.*)$": "<rootDir>/functions/src/util/$1",
    "^@functions(.*)$": "<rootDir>/functions/src/$1",
    "^@settings(.*)$": "<rootDir>/functions/src/settings$1",
    "^@helpers(.*)$": "<rootDir>/__tests__/helpers/$1",
  }
};