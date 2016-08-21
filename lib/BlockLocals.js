'use strict';

const TemplateLocals = require('./TemplateLocals');

module.exports = class BlockLocals extends TemplateLocals {
  constructor(current) {
    super(current);

    this.element = current.createElement.bind(current);
    this.attributes = current.getAttributes.bind(current);
    this.mod = current.getMod.bind(current);
    this.isMod = current.isMod.bind(current);
  }
};
