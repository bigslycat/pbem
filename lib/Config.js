'use strict';

const path = require('path');

class Config {
  constructor(newConfig = {}) {
    let pugOptions = {
      pretty: false
    };

    Object.assign(this, {
      get pugOptions() {
        return pugOptions;
      },

      set pugOptions(value) {
        return Object.assign(pugOptions, value);
      }
    }, newConfig);
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
