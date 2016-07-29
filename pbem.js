'use strict';

const PRIVATE = Symbol();

const scope = {};

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

const config = require('./config');
const objectFilter = require('./helpers/objectFilter');

module.exports = Object.assign(
  function setConfig(newConfig) {
    Object.assign(config, newConfig);

    return setConfig;
  }, {
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
