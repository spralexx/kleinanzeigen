module.exports = {
	'env': {
		'browser': true,
		'node': true
	},
	parserOptions: {
		ecmaVersion: 8
	},
	'extends': 'eslint:recommended',
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'no-console': ['error', { 'allow': ['warn', 'error','log'] }]
	}
};
