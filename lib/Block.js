'use strict';

const decamelize = require('decamelize');

module.exports = function(PRIVATE, scope) {
  scope.Block = class Block extends scope.Template {
    constructor(name, options) {
      super(name, options);

      this.local({
        element: this.createElement.bind(this),
        attributes: this.getAttributes.bind(this)
      });

      let mixes = this[PRIVATE].mixes;
      this[PRIVATE].mixes = [];
      this.mix(mixes);
    }

    mix() {
      if (!arguments.length) {
        return this;
      }

      let mixes = Array.isArray(arguments[0]) ?
        arguments[0] :
        [Array.prototype.slice.call(arguments)];

      for (let mix of mixes) {
        let mixObject;

        if (Array.isArray(mix)) {
          mixObject = {
            block: mix[0]
          };

          if (typeof mix[1] === 'string') {
            mixObject.element = mix[1];
          }

          if (
            typeof mix[1] === 'object' ||
            typeof mix[2] === 'object'
          ) {
            mixObject.mods = mix.length === 2 ? mix[1] : mix[2];
          }
        } else if (typeof mix === 'object') {
          mixObject = mix;
        }

        this[PRIVATE].mixes.push(mixObject);
      }

      return this;
    }

    getAttributes() {
      let currentBlockName = this.block.name;
      let currentElementName = this.isBlock ? null : this.name;

      let classNames = [
        this[PRIVATE].getClassName(
          currentBlockName,
          currentElementName
        )
      ].concat(
        this[PRIVATE].getModClassNames(
          currentBlockName,
          currentElementName,
          this[PRIVATE].mods
        )
      );

      let mixesClassNames = [];

      for (let mix of this[PRIVATE].mixes) {
        mixesClassNames.push(this[PRIVATE].getClassName(
          mix.block,
          mix.element
        ));

        mixesClassNames.push(this[PRIVATE].getModClassNames(
          mix.block,
          mix.element,
          mix.mods
        ));
      }

      let attributes = Object.assign({}, this[PRIVATE].attributes, {
        class: Array.prototype.concat.apply(
          classNames,
          mixesClassNames
        )
      });

      for (let propertyName in this[PRIVATE].data) {
        let dataAttrName = decamelize(`data-${propertyName}`, '-');

        attributes[dataAttrName] = this[PRIVATE].data[propertyName];
      }

      return attributes;
    }

    createElement(name, options = {}) {
      return new scope.Element(
        name,
        this[PRIVATE].extendsOptionsElement(options)
      );
    }
  };
};
