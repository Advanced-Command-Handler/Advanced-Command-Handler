import eslint from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';
import tseslint from 'typescript-eslint';

export default tseslint.config(eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	jsdoc.configs['flat/recommended-typescript'],
	{
		ignores: [
			'**/node_modules',
			'**/dist',
			'**/types',
		],
	},
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
				ecmaVersion: 2023,
				sourceType: 'module',
			},
		},
		files: [
			'src/**/*.ts',
			'tests/**/*.js',
		],
		plugins: {
			jsdoc,
		},
		rules: {
			'no-control-regex': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					caughtErrors: 'none',
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-duplicate-enum-values': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-declaration-merging': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/unbound-method': 'off',
			'@typescript-eslint/no-misused-promises': [
				'error',
				{
					checksVoidReturn: false,
				},
			],
			'jsdoc/check-tag-names': 'off',
			'jsdoc/require-description': [
				'warn',
				{
					'checkConstructors': false,
				},
			],
			'jsdoc/require-description-complete-sentence': 'warn',
			'jsdoc/require-jsdoc': [
				'warn',
				{
					'checkGetters': true,
					'checkSetters': true,
					'contexts': [
						'ClassProperty',
					],
					'publicOnly': false,
					'require': {
						'MethodDefinition': true,
					},
				},
			],
			'jsdoc/require-param-type': 'off',
			'jsdoc/require-returns': [
				'warn',
				{
					'checkGetters': false,
				},
			],
			'jsdoc/require-returns-type': 'off',
			'jsdoc/tag-lines': [
				'warn',
				'any',
				{
					'startLines': 1,
				},
			],
		},
	},
	{
		files: ['**/*.js'], ...tseslint.configs.disableTypeChecked,
	},
);
