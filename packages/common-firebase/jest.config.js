module.exports = {
  testMatch: [
    // '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: [
    'json-summary',
    'text',
    'lcov'
  ],
  // setupFilesAfterEnv: ['<rootDir>/__tests__/setup.tests.ts'],
  "moduleNameMapper": {
    "^@root(.*)$": "<rootDir>/$1",
    "^@env(.*)$": "<rootDir>/env/$1",
    "^@functions(.*)$": "<rootDir>/functions/$1",
    "^@helpers(.*)$": "<rootDir>/__tests__/helpers/$1",
  }
};