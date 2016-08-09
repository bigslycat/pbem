'use strict';

const path = require('path');
const glob = require('glob');

const Config = require('./Config');

const objectFilter = require('../helpers/objectFilter');
const getCompiledTemplate = require('../helpers/getCompiledTemplate');

const scope = require('../scope');

const {
  templateFilterOptions,
  blockFilterOptions
} = scope;

module.exports = class PBEM {
  constructor(newConfig) {
    let scopeConfig = new Config(newConfig);

    this.precompile = function() {
      let {viewsDir, blocksDir, templateExt, pugOptions} = scopeConfig;

      let filePatternPart = '*' + templateExt;
      let viewsPathsPattern = path.join(viewsDir, filePatternPart);
      let blocksPathsPattern = path.join(blocksDir, '**', filePatternPart);

      glob.sync(viewsPathsPattern).concat(
        glob.sync(blocksPathsPattern)
      ).forEach(templatePath => getCompiledTemplate(templatePath, pugOptions));

      return this;
    };

    this.createTemplate = function(name, options = {}) {
      options.scopeConfig = scopeConfig;

      return new scope.Template(
        name,
        objectFilter(options, templateFilterOptions)
      );
    };

    this.createBlock = function(name, options = {}) {
      options.scopeConfig = scopeConfig;

      return new scope.Block(
        name,
        objectFilter(options, blockFilterOptions)
      );
    };
  }
};
