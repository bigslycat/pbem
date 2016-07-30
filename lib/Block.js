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
      let mixes;
      let isValid = this[PRIVATE].isValidMixObject;

      if (isValid(arguments)) {
        mixes = [Array.prototype.slice.call(arguments)];
      } else if (isValid(arguments[0])) {
        mixes = Array.prototype.slice.call(arguments);
      } else if (
        Array.isArray(arguments[0]) &&
        isValid(arguments[0][0])
      ) {
        mixes = arguments[0];
      }

      for (let mix of mixes || []) {
        let mixObject = this[PRIVATE].createMixObject(mix);

        if (mixObject) {
          this[PRIVATE].mixes.push(mixObject);
        }
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
