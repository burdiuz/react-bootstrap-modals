# JS-Lib-Environment

Bunch of useful stuff that I've used in some of my projects

Environment setup for library project development.
After installation replace values of `LIBRARY_FILE_NAME` and `LIBRARY_VAR_NAME` in `webpack.helpers.js`.
* `LIBRARY_FILE_NAME` - distribution file name
* `LIBRARY_VAR_NAME` - variable name for global variable

Also you will need to update `"main"` value in `bower.json` and `package.json`.

NPM commands:
* `npm start` - run webpack to make distributions
* `npm test` - run karma tests
* `npm run server` - run webpack dev server
* `npm run flow` - run flow for static type checking
* `npm run build:watch` - run webpack in watch mode
* `npm run test:watch` - run tests in watch mode
* `npm run lint` - run ESLint for project files(non-spec files) in `/source` folder.
* `npm run lint:spec` - run ESLint for test(*.spec.js) files in `/source` and `/tests` folders.
