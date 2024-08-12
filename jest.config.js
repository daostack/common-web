module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.[jt]sx?$": "ts-jest",
  },
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect",
    "jest-extended/all",
    "<rootDir>/src/shared/utils/tests/setupTests.ts",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^.+\\.(gif|ttf|eot|svg|png|jpe?g|pdf|mp4)$":
      "<rootDir>/src/shared/utils/tests/mockFile.ts",
    "^.+\\.(css|less|scss)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/public/"],
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!lodash-es)"],
  testEnvironment: "jsdom",
};
