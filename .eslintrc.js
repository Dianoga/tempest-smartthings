module.exports = {
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	plugins: ['simple-import-sort', '@typescript-eslint'],
	env: {
		es6: true,
		node: true,
	},
	parserOptions: {
		parser: '@typescript-eslint/parser',
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	rules: {
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
		'func-names': 0,
		'class-methods-use-this': 0,
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/no-var-requires': 0,
		'no-return-await': 0,
	},
};
