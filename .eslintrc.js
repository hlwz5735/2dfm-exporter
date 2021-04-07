module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': ['off', 'never'],
    'vue/max-attributes-per-line': ['error', { 'singleline': 100, 'multiline': { 'max': 100, 'allowFirstLine': true } }],
    'vue/html-self-closing': ['error', { 'html': { 'normal': 'any' } }]
  }
}
