'use strict';

const path = require('path');
const decamelize = require('decamelize');

const compiledTemplates = {
  templates: {},
  blocks: {}
};

const objectFilter = require('../helpers/objectFilter');

module.exports = function(PRIVATE, config) {
  return {
    extendsOptionsBlock: function(options) {
      return Object.assign({
        pugOptions: this[PRIVATE].pugOptions
      }, objectFilter(
        options,
        'mods',
        'mixes',
        'data',
        'attributes',
        'locals',
        'pugOptions',
        'debug'
      ), {
        template: this.template,
        parent: this
      });
    }.bind(this),

    extendsOptionsElement: function(options) {
      return Object.assign(this[PRIVATE].extendsOptionsBlock(options), {
        block: this.block
      });
    }.bind(this),

    setParam: function(paramType, paramName, paramValue = true) {
      if (typeof paramName === 'string') {
        if (typeof paramValue !== 'undefined') {
          this[PRIVATE][paramType][paramName] = paramValue;

          return this;
        }

        return this[PRIVATE][paramType][paramName];
      } else if (typeof paramName === 'object') {
        Object.assign(this[PRIVATE][paramType], paramName);
      } else if (typeof paramName === 'undefined') {
        return this[PRIVATE][paramType];
      }

      return this;
    }.bind(this),

    getTemplatesScope: function() {
      if (this.isTemplate) {
        return compiledTemplates.templates;
      } else if (this.isBlock) {
        return compiledTemplates.blocks;
      }

      let blockName = this.block.name;

      if (!compiledTemplates.blocks[blockName]) {
        compiledTemplates.blocks[blockName] = {};
      }

      if (!compiledTemplates.blocks[blockName].elements) {
        compiledTemplates.blocks[blockName].elements = {};
      }

      return compiledTemplates.blocks[blockName].elements;
    }.bind(this),

    getTemplateName: function() {
      if (this.isBlock || this.isTemplate) {
        return this.name;
      }

      return `${this.block.name}__${this.name}`;
    }.bind(this),

    getTemplatePath: function() {
      if (this.isTemplate) {
        return path.join(config.viewsDir, `${this.name}.pug`);
      } else if (this.isBlock) {
        return path.join(
          config.blocksDir,
          this.name,
          `${this.name}.pug`
        );
      }

      return path.join(
        config.blocksDir,
        this.block.name,
        `__${this.name}`,
        `${this[PRIVATE].getTemplateName()}.pug`
      );
    }.bind(this),

    getClassName: function(block, element, modName, modValue) {
      let className = block;

      if (element) {
        className += `__${element}`;
      }

      if (modName && modValue) {
        className += `_${decamelize(modName, '-')}`;

        if (modValue !== true) {
          className += `_${decamelize(modValue, '-')}`;
        }
      }

      return className;
    },

    getModClassNames: function(block, element, mods) {
      let modClassNames = [];

      for (let modName in mods) {
        let modValue = mods[modName];

        if (modValue) {
          modClassNames.push(this[PRIVATE].getClassName(
            block,
            element,
            modName,
            modValue
          ));
        }
      }

      return modClassNames;
    }.bind(this)
  };
};
