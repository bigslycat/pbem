'use strict';

const scope = require('../scope');

module.exports = function(PRIVATE) {
  scope.Element = scope.Element || class Element extends scope.Block {
    createElement(name, options = {}) {
      return this.block.createElement(
        name,
        this[PRIVATE].extendsOptionsElement(options)
      );
    }
  };
};
