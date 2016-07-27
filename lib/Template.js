'use strict';

const pug = require('pug');

const privateMethodsInit = require('./privateMethods');
const config = require('../config');

const compiledTemplates = {
  templates: {},
  blocks: {}
};

module.exports = function(PRIVATE, scope) {
  scope.Template = class Template {
    constructor(name, options = {}) {
      this[PRIVATE] = Object.assign({
        name,
        template: this,
        block: this === options.template ? null : this,
        parent: null,
        mods: {},
        mixes: [],
        data: {},
        attributes: {},
        locals: {},
        pugOptions: {},
        debug: false
      }, options, privateMethodsInit.call(this, {
        PRIVATE,
        config,
        compiledTemplates
      }));

      let {pugOptions, debug} = this[PRIVATE];

      pugOptions = Object.assign({}, config.pugOptions, pugOptions);

      let templatePath = this[PRIVATE].getTemplatePath();
      let templateName = this[PRIVATE].getTemplateName();
      let templatesScope = this[PRIVATE].getTemplatesScope();

      this[PRIVATE].compiledTemplate = pug.compileFile(
        templatePath,
        pugOptions
      );

      if (!templatesScope[templateName]) {
        templatesScope[templateName] = {
          compiled: this[PRIVATE].compiledTemplate
        };
      }

      if (debug) {
        this.privates = this[PRIVATE];
      }

      this.local({
        current: this,
        block: this.createBlock.bind(this)
      });
    }

    get isTemplate() {
      return this === this[PRIVATE].template;
    }

    get isBlock() {
      return this === this[PRIVATE].block;
    }

    get isElement() {
      return !this.isTemplate && !this.isBlock;
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
