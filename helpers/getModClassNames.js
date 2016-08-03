'use strict';

const getClassName = require('./getClassName');

module.exports = (scopeConfig, block, element, mods) => {
  let modClassNames = [];

  for (let modName in mods) {
    let modValue = mods[modName];

    if (modValue) {
      modClassNames.push(getClassName(
        scopeConfig,
        block,
        element,
        modName,
        modValue
      ));
    }
  }

  return modClassNames;
};
