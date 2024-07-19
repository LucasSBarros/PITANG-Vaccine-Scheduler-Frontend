const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    [
      'babel-plugin-transform-import-meta',
      {
        'env': {
          'NODE_ENV': 'test',
        },
      },
    ],
  ],
});