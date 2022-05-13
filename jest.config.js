module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.[jt]sx?$": "ts-jest",
  },
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect",
    "<rootDir>/src/shared/utils/tests/setupTests.ts",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^.+\\.(gif|ttf|eot|svg|png)$":
      "<rootDir>/src/shared/utils/tests/mockFile.ts",
    "^.+\\.(css|less|scss)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/public/"],
  testEnvironment: "jsdom",
};
