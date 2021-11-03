/** @type {import("@jest/types").Config.InitialOptions} */
const config = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  "testRegex": "./tests/unit/.*.test.ts$",
  moduleNameMapper: {
    "^\\$lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@utils/(.*)$": "<rootDir>/src/lib/utils/$1",
    "^@product/(.*)$": "<rootDir>/src/lib/product/$1",
    "^@ProductConfig/(.*)$": "<rootDir>/src/lib/product-config/$1",
  },
};

// noinspection JSUnusedGlobalSymbols
export default config;
