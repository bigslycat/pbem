'use strict';

module.exports = class TemplateLocals {
  constructor(current) {
    this.local = current.local.bind(current);
    this.block = current.createBlock.bind(current);
  }
};
