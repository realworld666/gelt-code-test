import organizeImportsPlugin from 'prettier-plugin-organize-imports';


export default {
  organizeImportsSkipDestructiveCodeActions: true,
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  plugins: [organizeImportsPlugin],
  printWidth: 100,
};
