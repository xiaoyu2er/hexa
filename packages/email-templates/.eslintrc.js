/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@hexa/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.lint.json",
    tsconfigRootDir: __dirname,
  },
};
