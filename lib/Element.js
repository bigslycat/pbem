'use strict';

module.exports = function(PRIVATE, scope) {
  scope.Element = class Element extends scope.Block {
    createElement(name, options = {}) {
      return this.block.createElement(
        name,
        this[PRIVATE].extendsOptionsElement(options)
      );
    }
  };
};
