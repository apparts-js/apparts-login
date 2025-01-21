const rules = {
  "react/prop-types": 1,
  "no-unused-vars": 1,
  "no-var": "error",
  "prefer-const": "error",
  "no-unneeded-ternary": "error",
  "prefer-arrow-callback": "error",
  "consistent-return": ["error", { treatUndefinedAsUnspecified: false }],
};

const globals = {
  history: false,
};

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  globals,
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks"],
  overrides: [
    {
      files: ["*-?test.js", "*test.js"],
      env: {
        jest: true,
      },
    },
    {
      globals,
      files: ["*.tsx", "*.ts"],
      plugins: ["@typescript-eslint", "react", "react-hooks"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "prettier",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "tsconfig.json",
        sourceType: "module",
      },
      rules: {
        ...rules,
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "react/react-in-jsx-scope": 0,
        "no-unused-vars": 0,
        "@typescript-eslint/no-empty-function": 1,
      },
    },
  ],
  rules,
  settings: {
    react: {
      version: "detect",
    },
  },
};
