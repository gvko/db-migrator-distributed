module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],

  parserOptions: {
    // The project field is required in order for some TS-syntax-specific rules to function at all
    // @see https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser#configuration
    project: './tsconfig.json',
  },

  rules: {
    'max-len': ['warn', 120, 2],
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/semi': 0,
    'semi-style': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/camelcase': 0,
    'import/order': 0,
    'comma-dangle': 0,
    'no-undefined': 0,
    'multiline-comment-style': 0,
    'space-before-function-paren': 0,
    'import/no-anonymous-default-export': 0,
    'no-implicit-coercion': 0,
    'function-paren-newline': 0,
    'id-length': 0,
    'import/extensions': 0,
    // lint is returning error when this rule is enabled
    'import/no-unused-modules': 0,
    '@typescript-eslint/space-before-function-paren': 0,
    '@typescript-eslint/restrict-template-expressions': 0,
    '@typescript-eslint/member-ordering': 0,
    'no-await-in-loop': 0,
    'no-underscore-dangle': 0
  },

};
