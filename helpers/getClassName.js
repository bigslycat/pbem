'use strict';

const decamelize = require('decamelize');

module.exports = (scopeConfig, block, element, modName, modValue) => {
  let {
    elementDelimiter,
    modifierDelimiter,
    modifierValueDelimiter,
    vordsDelimiter
  } = scopeConfig;

  let className = block;

  if (element) {
    className += elementDelimiter + element;
  }

  if (modName && modValue) {
    className += modifierDelimiter + (
      vordsDelimiter ? decamelize(modName, vordsDelimiter) : modName
    );

    if (modValue !== true) {
      className += modifierValueDelimiter + (
        vordsDelimiter ? decamelize(modValue, vordsDelimiter) : modValue
      );
    }
  }

  return className;
};
