import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": ts,
    },
    rules: {
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      // "semi": ["error", "always"],
      // "quotes": ["error", "double"],
    },
  },
];
