const path = require('path');

const LIBRARY_FILE_NAME = 'lib'; // dummy, replace with project name
const LIBRARY_VAR_NAME = 'lib'; // dummy, replace with project name

const p = (value) => path.resolve(__dirname, value);

const getBabelLoader = (plugins = []) => ({
  loader: 'babel-loader',
  options: {
    presets: [
      ['env', {
        targets: {
          browsers: ['last 2 versions'],
          node: '8.4.0',
        },
        modules: false,
      }],
    ],
    plugins: [
      ...plugins,
      'babel-plugin-transform-flow-strip-types',
      'babel-plugin-transform-class-properties',
      ['babel-plugin-transform-object-rest-spread', { 'useBuiltIns': true }],
    ],
  },
});

module.exports = {
  p,
  LIBRARY_FILE_NAME,
  LIBRARY_VAR_NAME,
  getBabelLoader,
};
