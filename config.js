'use strict';

const path = require('path');

const cwd = process.cwd();

module.exports = {
  viewsDir: path.join(cwd, 'views'),
  blocksDir: path.join(cwd, 'views', 'blocks'),
  pugOptions: {
    pretty: false
  }
};
