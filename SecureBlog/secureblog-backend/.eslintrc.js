// .eslintrc.js
module.exports = {
  env: {
    node: true, // Node.js global variables
    es2021: true, // Modern ECMAScript features
    jest: true // Jest global variables
  },
  extends: [
    "eslint:recommended", // Basic recommended rules
    "plugin:node/recommended", // Node.js-specific rules
    "standard" // JavaScript Standard Style rules
  ],
  parserOptions: {
    ecmaVersion: "latest", // Use latest ECMAScript syntax
    sourceType: "module"
  },
  rules: {
    "no-unused-vars": ["warn"], // Warn about unused variables
    "no-console": "off", // Allow console.log during development
    semi: ["error", "always"], // Enforce semicolons
    quotes: ["error", "double"], // Enforce double quotes

    // Allow dev/test packages like supertest without errors
    "node/no-unpublished-require": ["error", { allowModules: ["supertest"] }]
  },
  ignorePatterns: [
    "node_modules/",
    "coverage/",
    "ssl/",
    "dist/"
  ]
};
