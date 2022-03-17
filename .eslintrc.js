module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    history: false,
    process: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react"],
  overrides: [
    {
      files: ["*-?test.js", "*test.js"],
      env: {
        jest: true,
        node: true,
      },
    },
  ],
  rules: {
    "react/prop-types": 1,
    "no-unused-vars": 1,
    "no-var": "error",
    "prefer-const": "error",
    "no-unneeded-ternary": "error",
    "prefer-arrow-callback": "error",
    "consistent-return": ["error", { treatUndefinedAsUnspecified: false }],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
