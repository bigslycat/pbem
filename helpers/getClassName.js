'use strict';

const decamelize = require('decamelize');
const config = require('../lib/Config');

module.exports = (block, element, modName, modValue) => {
  let {
    elementDelimiter,
    modifierDelimiter,
    modifierValueDelimiter,
    vordsDelimiter
  } = config;

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
