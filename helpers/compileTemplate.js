'use strict';

const pug = require('pug');

const config = require('../lib/Config');
const {compiledTemplates} = require('../scope');

module.exports = templatePath => {
  if (!compiledTemplates[templatePath]) {
    compiledTemplates[templatePath] = pug.compileFile(
      templatePath,
      Object.assign({}, config.pugOptions)
    );
  }

  return compiledTemplates[templatePath];
};
