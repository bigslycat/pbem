'use strict';

const privateMethodsInit = require('./privateMethods');
const config = require('../lib/Config');

const scope = require('../scope');

const {
  TYPE_TEMPLATE,
  TYPE_BLOCK,
  TYPE_ELEMENT
} = scope;

const compileTemplate = require('../helpers/compileTemplate');

module.exports = function(PRIVATE) {
  scope.Template = scope.Template || class Template {
    constructor(name, options = {}) {
      this[PRIVATE] = Object.assign({
        template: this,
        block: this === options.template ? null : this,
        parent: null,
        mods: {},
        mixes: [],
        data: {},
        attributes: {},
        locals: {},
        debug: false
      }, options, {
        name
      }, privateMethodsInit.call(this, PRIVATE));

      let privates = this[PRIVATE];

      privates.pugOptions = privates.pugOptions ?
        Object.assign({}, config.pugOptions, privates.pugOptions) :
        Object.assign({}, config.pugOptions);

      if (this === this.template) {
        privates.type = TYPE_TEMPLATE;
      } else if (this === this.block) {
        privates.type = TYPE_BLOCK;
      } else {
        privates.type = TYPE_ELEMENT;
      }

      privates.compiledTemplate = compileTemplate(
        privates.getTemplatePath()
      );

      if (privates.debug) {
        this.privates = privates;
      }

      this.local({
        current: this,
        block: this.createBlock.bind(this)
      });
    }

    get isTemplate() {
      return this[PRIVATE].type === TYPE_TEMPLATE;
    }

    get isBlock() {
      return this[PRIVATE].type === TYPE_BLOCK;
    }

    get isElement() {
      return this[PRIVATE].type === TYPE_ELEMENT;
    }

    createBlock(name, options = {}) {
      return new scope.Block(
        name,
        this[PRIVATE].extendsOptionsBlock(options)
      );
    }

    get name() {
      return this[PRIVATE].name;
    }

    get debug() {
      return this[PRIVATE].debug;
    }

    get template() {
      return this[PRIVATE].template;
    }

    get block() {
      return this[PRIVATE].block;
    }

    get parent() {
      return this[PRIVATE].parent;
    }

    toString() {
      return this[PRIVATE].compiledTemplate(this[PRIVATE].locals);
    }
  };
};
