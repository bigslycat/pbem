'use strict';

const path = require('path');

class Config {
  constructor(newConfig) {
    let options = {
      pug: {
        pretty: false
      },

      beautify: {
        /* eslint-disable camelcase */
        indent_size: 2,
        indent_char: ' '
        /* eslint-enable camelcase */
      }
    };

    this.set = function(newConfig = {}) {
      Object.assign(this, {
        get pugOptions() {
          return options.pug;
        },

        set pugOptions(pugOptions) {
          Object.assign(options.pug, pugOptions);
        },

        get beautify() {
          return options.beautify;
        },

        set beautify(beautifyOptions) {
          Object.assign(options.beautify, beautifyOptions);
        }
      }, newConfig);

      this.beautifyOn = this.pugOptions.pretty;
      this.pugOptions.pretty = false;
    };

    this.set(newConfig);
  }
}

let viewsDir = path.join(process.cwd(), 'views');
let blocksDir = path.join(viewsDir, 'blocks');

Object.assign(Config.prototype, {
  viewsDir,
  blocksDir,
  templateExt: '.pug',
  elementDelimiter: '__',
  modifierDelimiter: '_',
  modifierValueDelimiter: '_',
  vordsDelimiter: '-'
});

module.exports = Config;
