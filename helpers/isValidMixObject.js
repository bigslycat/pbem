'use strict';

module.exports = checkingValue =>
  typeof checkingValue === 'object' && (
    typeof checkingValue[0] === 'string' ||
    typeof checkingValue.block === 'string'
  );
