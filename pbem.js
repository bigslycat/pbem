'use strict';

const PRIVATE = Symbol();

const scope = {};

require('./lib/Template')(PRIVATE, scope);
require('./lib/Block')(PRIVATE, scope);
require('./lib/Element')(PRIVATE, scope);

const presetMethodsMaping = {
  mod: {
    type: 'mods',
    targetClass: scope.Element
  },
  attr: {
    type: 'attributes',
    targetClass: scope.Element
  },
  data: {
    type: 'data',
    targetClass: scope.Element
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
