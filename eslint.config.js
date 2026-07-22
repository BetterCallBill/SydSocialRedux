import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            // Only the classic rules-of-hooks + exhaustive-deps, matching the pre-upgrade
            // config. eslint-plugin-react-hooks v7's "recommended" bundles a much stricter
            // set of React Compiler-readiness rules (immutability, purity, refs, etc.) that
            // surface real findings in this codebase (see ROADMAP.md) — adopting those is a
            // separate, deliberate task, not a side effect of a lint tooling bump.
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    }
);
