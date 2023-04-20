module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'standard-with-typescript',
    'airbnb',
    'airbnb-typescript',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './api/tsconfig.json'],
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'jsx-a11y',
    'react',
    'react-hooks'
  ],
  rules: {
    'react/jsx-no-constructed-context-values': 'warn',
    'no-trailing-spaces': 'off',
    'react/function-component-definition': 'warn',
    "max-len": ["warn", { "code": 170, "ignoreComments": true }],
    'react/button-has-type': 'warn',
    'import/extensions': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton']
      }
    ],
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    indent: ['error', 2, {
      ignoredNodes: ['TemplateLiteral'],
      SwitchCase: 1
    }],
    'no-unused-vars': 'off',
    'multiline-ternary': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    semi: [2, 'always'],
    '@typescript-eslint/semi': [2, 'always'],
    '@typescript-eslint/triple-slash-reference': 'off',
    'react/jsx-indent-props': [2, 'first'],
    'react/jsx-max-props-per-line': [2, { when: 'multiline' }],
    'react/react-in-jsx-scope': 'off',
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    "object-curly-newline": ["error", {
      "multiline": true,
      "minProperties": 5,
    }]
  }
};
