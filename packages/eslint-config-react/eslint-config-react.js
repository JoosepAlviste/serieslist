module.exports = {
  extends: [
    '@serieslist/eslint-config-base',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['react-refresh'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  rules: {
    'react-refresh/only-export-components': 'error',
  },
}
