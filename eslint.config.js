import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { fixupPluginRules, includeIgnoreFile } from "@eslint/compat";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".prettierignore");

export default tseslint.config(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      /* https://github.com/facebook/react/issues/28313#issuecomment-2119166334 */
      "react-hooks": fixupPluginRules(eslintPluginReactHooks),
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      "no-console": "warn",
    },
  },
);
