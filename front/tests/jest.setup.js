require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  ignore: [
    /node_modules\/(?!(fp-ts\/es6))/g,
  ],
});
require('@babel/polyfill');
