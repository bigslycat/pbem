'use strict';

const PRIVATE = Symbol();

require('./lib/Template')(PRIVATE);
require('./lib/Block')(PRIVATE);
require('./lib/Element')(PRIVATE);

const scope = require('./scope');

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

const PBEM = require('./lib/PBEM');

function pbem(newConfig) {
  return new PBEM(newConfig);
}

pbem.createTemplate = function(name, options) {
  return pbem().createTemplate(name, options);
};

module.exports = pbem;
