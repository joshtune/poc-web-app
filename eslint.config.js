import js from '@eslint/js';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

function applySvelteSettings(configs) {
	return configs.map((config) => {
		if (!config.files?.some((pattern) => pattern.includes('.svelte'))) {
			return config;
		}

		const existingExtraExtensions =
			config.languageOptions?.parserOptions?.extraFileExtensions ?? [];
		const extraFileExtensions = Array.from(new Set([...existingExtraExtensions, '.svelte']));

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
					extraFileExtensions,
					parser: {
						...config.languageOptions?.parserOptions?.parser,
						ts: tseslint.parser
					}
				}
			}
		};
	});
}

const svelteRecommended = applySvelteSettings(eslintPluginSvelte.configs['flat/recommended']);
const sveltePrettier = applySvelteSettings(eslintPluginSvelte.configs['flat/prettier']);

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	{
		ignores: ['.svelte-kit', 'build', 'dist']
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...svelteRecommended,
	...sveltePrettier,
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
