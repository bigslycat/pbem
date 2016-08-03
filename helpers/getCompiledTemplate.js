'use strict';

const pug = require('pug');

const {compiledTemplates} = require('../scope');

module.exports = (templatePath, pugOptions = {}) => {
  if (!compiledTemplates[templatePath]) {
    compiledTemplates[templatePath] = pug.compileFile(
      templatePath,
      Object.assign({}, pugOptions)
    );
  }

  return compiledTemplates[templatePath];
};
