import js from '@eslint/js';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const svelteRecommended = eslintPluginSvelte.configs['flat/recommended'].map((config) => {
	if (config.files?.some((pattern) => pattern.includes('.svelte'))) {
		return {
			...config,
			languageOptions: {
				...config.languageOptions,
				globals: {
					...globals.browser,
					...globals.node,
					...config.languageOptions?.globals
				},
				parserOptions: {
					...config.languageOptions?.parserOptions,
					extraFileExtensions: ['.svelte'],
					parser: {
						ts: tseslint.parser
					}
				}
			}
		};
	}

	return config;
});

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	{
		ignores: ['.svelte-kit', 'build', 'dist']
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...svelteRecommended,
	...eslintPluginSvelte.configs['flat/prettier'],
	{
		files: ['**/*.{js,ts}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	eslintConfigPrettier
];
