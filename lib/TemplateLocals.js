'use strict';

module.exports = class TemplateLocals {
  constructor(current) {
    this.current = current;
    this.local = current.local.bind(current);
    this.block = current.createBlock.bind(current);
  }
};
