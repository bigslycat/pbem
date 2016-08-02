'use strict';

const isValidMixObject = require('./isValidMixObject');

module.exports = mix => {
  let mixObject;

  if (isValidMixObject(mix)) {
    if (Array.isArray(mix)) {
      mixObject = {
        block: mix[0]
      };

      if (typeof mix[1] === 'string') {
        mixObject.element = mix[1];
      }

      if (
        typeof mix[1] === 'object' ||
        typeof mix[2] === 'object'
      ) {
        mixObject.mods = mix.length === 2 ? mix[1] : mix[2];
      }
    } else {
      mixObject = mix;
    }
  }

  return mixObject;
};
