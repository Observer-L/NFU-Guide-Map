module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
    "prettier/@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
    // project: "./tsconfig.json"
  },
  globals: {
    wx: true,
    App: true,
    Page: true,
    Component: true,
    getApp: true,
    getCurrentPages: true,
    Behavior: true
  },
  rules: {
    indent: [
      "warn",
      2,
      {
        SwitchCase: 1,
        ignoredNodes: ["ConditionalExpression"]
      }
    ],
    "prettier/prettier": "error",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        args: "none"
      }
    ],
    "@typescript-eslint/no-use-before-define": [
      "warn",
      {
        functions: false
      }
    ],
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-this-alias": 0,
    camelcase: [
      "warn",
      {
        ignoreDestructuring: true
      }
    ],
    "@typescript-eslint/camelcase": [
      "warn",
      {
        ignoreDestructuring: true
      }
    ],
    "@typescript-eslint/no-non-null-assertion": 0,
    "no-console": 0,
    "no-unused-expressions": [
      "warn",
      {
        allowShortCircuit: true,
        allowTernary: true
      }
    ],
    "no-unused-vars": [
      "warn",
      {
        args: "none"
      }
    ],
    "no-use-before-define": [
      "warn",
      {
        functions: false
      }
    ],
    "no-useless-constructor": "warn",
    "prefer-const": "warn"
  }
};
