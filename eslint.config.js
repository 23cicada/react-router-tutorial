import js from "@eslint/js";
import tseslint from 'typescript-eslint';
import { fixupPluginRules } from "@eslint/compat";
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist'],
    plugins: {
      /* https://github.com/facebook/react/issues/28313#issuecomment-2119166334 */
      'react-hooks': fixupPluginRules(eslintPluginReactHooks)
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
    }
  }
)