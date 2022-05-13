module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.[jt]sx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^.+\\.(css|less|scss)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/public/"],
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/src/shared/utils/tests/setupTests.ts"],
};
