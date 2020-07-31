module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-empty': 'off',
  },
}
