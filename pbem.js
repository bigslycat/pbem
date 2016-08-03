'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const PRIVATE = Symbol();

const scope = require('./scope');

require('./lib/Template')(PRIVATE, scope);
require('./lib/Block')(PRIVATE, scope);
require('./lib/Element')(PRIVATE, scope);

const presetMethodsMaping = {
  mod: {
    type: 'mods',
    targetClass: scope.Block
  },
  attr: {
    type: 'attributes',
    targetClass: scope.Block
  },
  data: {
    type: 'data',
    targetClass: scope.Block
  },
  local: {
    type: 'locals',
    targetClass: scope.Template
  }
};

for (let methodName in presetMethodsMaping) {
  let {type, targetClass} = presetMethodsMaping[methodName];

  targetClass.prototype[methodName] = function(name, value) {
    return this[PRIVATE].setParam(type, name, value);
  };
}

const config = require('./lib/Config');
const objectFilter = require('./helpers/objectFilter');
const compileTemplate = require('./helpers/compileTemplate');

module.exports = Object.assign(
  function setConfig(newConfig) {
    Object.assign(config, newConfig);

    config.viewsDir = fs.realpathSync(config.viewsDir);
    config.blocksDir = fs.realpathSync(config.blocksDir);

    return setConfig;
  }, {
    precompile() {
      let {viewsDir, blocksDir} = config;

      let filePatternPart = '*' + config.templateExt;
      let viewsPathsPattern = path.join(viewsDir, filePatternPart);
      let blocksPathsPattern = path.join(blocksDir, '**', filePatternPart);

      glob.sync(viewsPathsPattern).concat(
        glob.sync(blocksPathsPattern)
      ).forEach(templatePath => compileTemplate(templatePath));

      return this;
    },

    createTemplate(name, options = {}) {
      return new scope.Template(name, objectFilter(
        options,
        'locals',
        'pugOptions',
        'debug'
      ));
    }
  }
);
