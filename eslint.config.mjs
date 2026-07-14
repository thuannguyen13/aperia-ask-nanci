import js from "@eslint/js"
import tseslint from "typescript-eslint"
import reactHooks from "eslint-plugin-react-hooks"

// Flat config (ESLint 9). typescript-eslint drives TS/TSX; react-hooks guards
// hook usage. eslint-config-next isn't flat-compatible here, so this is a direct,
// pragmatic setup rather than the Next preset.
export default tseslint.config(
  { ignores: [".next/**", "node_modules/**", "wiki/**", "demo-context/**", "docs/**", "*.config.*"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { "react-hooks": reactHooks },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      }],
      ...reactHooks.configs.recommended.rules,
      // The concept context deliberately uses [] deps with stable setters/refs;
      // keep this informational rather than blocking.
      "react-hooks/exhaustive-deps": "warn",
      // react-hooks 7 flags the legitimate "reset state when an input changes"
      // pattern used across these panels/effects — informational, not a bug here.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
)
