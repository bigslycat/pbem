'use strict';

var beautify = require('js-beautify').html;

const privateMethodsInit = require('./privateMethods');

const scope = require('../scope');

const {
  TYPE_TEMPLATE,
  TYPE_BLOCK,
  TYPE_ELEMENT
} = scope;

const TemplateLocals = require('./TemplateLocals');
const BlockLocals = require('./BlockLocals');
const ElementLocals = require('./ElementLocals');

const localsClasses = {
  TemplateLocals,
  BlockLocals,
  ElementLocals
};

const entityTypes = {
  Template: TYPE_TEMPLATE,
  Block: TYPE_BLOCK,
  Element: TYPE_ELEMENT
};

const getCompiledTemplate = require('../helpers/getCompiledTemplate');

module.exports = function(PRIVATE) {
  scope.Template = scope.Template || class Template {
    constructor(name, options = {}) {
      const locals = new localsClasses[`${this.constructor.name}Locals`](this);

      this[PRIVATE] = Object.assign({
        get locals() {
          return locals;
        },

        set locals(newLocals) {
          Object.assign(locals, newLocals);
        },

        template: this,
        block: this,
        parent: null,
        mods: {},
        mixes: [],
        data: {},
        attributes: {},
        debug: false
      }, options, {
        name
      }, privateMethodsInit.call(this, PRIVATE));

      let privates = this[PRIVATE];

      privates.type = entityTypes[this.constructor.name];

      privates.compiledTemplate = getCompiledTemplate(
        privates.getTemplatePath(),
        this.scopeConfig.pugOptions
      );

      if (privates.debug) {
        this.privates = privates;
      }
    }

    get scopeConfig() {
      return this[PRIVATE].scopeConfig;
    }

    set scopeConfig(config) {
      this[PRIVATE].scopeConfig = config;
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
      let {
        beautifyOn,
        beautify: beautifyOptions
      } = this[PRIVATE].scopeConfig;

      let renderedTemplate = this[PRIVATE].compiledTemplate(
        this[PRIVATE].locals
      );

      return beautifyOn ?
        beautify(renderedTemplate, beautifyOptions) :
        renderedTemplate;
    }
  };
};
