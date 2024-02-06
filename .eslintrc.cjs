/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  rules: {
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['Button', 'Separator', 'Toast', 'Dialog']
      }
    ],
    'vue/html-button-has-type': [
      'error',
      {
        button: true,
        submit: true,
        reset: true
      }
    ]
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
