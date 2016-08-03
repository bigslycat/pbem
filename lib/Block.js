'use strict';

const decamelize = require('decamelize');

const getClassName = require('../helpers/getClassName');
const getModClassNames = require('../helpers/getModClassNames');
const isValidMixObject = require('../helpers/isValidMixObject');
const createMixObject = require('../helpers/createMixObject');

const scope = require('../scope');

module.exports = function(PRIVATE) {
  scope.Block = scope.Block || class Block extends scope.Template {
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

      if (isValidMixObject(arguments)) {
        mixes = [Array.prototype.slice.call(arguments)];
      } else if (isValidMixObject(arguments[0])) {
        mixes = Array.prototype.slice.call(arguments);
      } else if (
        Array.isArray(arguments[0]) &&
        isValidMixObject(arguments[0][0])
      ) {
        mixes = arguments[0];
      }

      for (let mix of mixes || []) {
        let mixObject = createMixObject(mix);

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
        getClassName(
          this.scopeConfig,
          currentBlockName,
          currentElementName
        )
      ].concat(
        getModClassNames(
          this.scopeConfig,
          currentBlockName,
          currentElementName,
          this[PRIVATE].mods
        )
      );

      let mixesClassNames = [];

      for (let mix of this[PRIVATE].mixes) {
        mixesClassNames.push(getClassName(
          this.scopeConfig,
          mix.block,
          mix.element
        ));

        mixesClassNames.push(getModClassNames(
          this.scopeConfig,
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
