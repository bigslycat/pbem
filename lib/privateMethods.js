'use strict';

const path = require('path');

const objectFilter = require('../helpers/objectFilter');
const getClassName = require('../helpers/getClassName');

module.exports = function(PRIVATE) {
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
        scopeConfig: this.scopeConfig,
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

    getTemplateName: function() {
      if (this.isBlock || this.isTemplate) {
        return this.name;
      }

      return getClassName(this.scopeConfig, this.block.name, this.name);
    }.bind(this),

    getTemplatePath: function() {
      let {
        viewsDir,
        blocksDir,
        templateExt,
        elementDelimiter
      } = this.scopeConfig;

      if (this.isTemplate) {
        return path.join(viewsDir, this.name + templateExt);
      } else if (this.isBlock) {
        return path.join(
          blocksDir,
          this.name,
          this.name + templateExt
        );
      }

      return path.join(
        blocksDir,
        this.block.name,
        elementDelimiter + this.name,
        this[PRIVATE].getTemplateName() + templateExt
      );
    }.bind(this)
  };
};
