'use strict';

module.exports = function objectFilter(target) {
  let keys = Array.isArray(arguments[1]) ?
    arguments[1] :
    Array.prototype.slice.call(arguments, 1);

  let result = {};

  for (let key of keys) {
    if (typeof target[key] !== 'undefined') {
      result[key] = target[key];
    }
  }

  return result;
};
