// jest.config.js
module.exports = {
  // Root directory for Jest
  rootDir: "./",

  // Test environment
  testEnvironment: "node",

  // Look for test files in the "tests" folder
  testMatch: ["<rootDir>/tests/**/*.test.js"],

  // Clear mocks between tests
  clearMocks: true,

  // Collect coverage information
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage",

  // Verbose output
  verbose: true,

  // Ignore node_modules
  modulePathIgnorePatterns: ["<rootDir>/node_modules/"],

  // Setup files before running tests
  setupFilesAfterEnv: [],

  // Transform (optional, if using ES modules)
  transform: {}
};
