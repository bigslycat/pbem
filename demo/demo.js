'use strict';

const path = require('path');
const pbem = require('../pbem');

pbem({
  viewsDir: path.join(__dirname, 'views'),
  blocksDir: path.join(__dirname, 'views', 'blocks'),
  pugOptions: {
    pretty: true
  }
});

let data = {
  pageTitle: 'PBEM',
  pageDescription: 'BEM-helper system for Pug (Jade)',
  content: 'Hello World!',
  license: {
    type: 'MIT',
    url: 'http://opensource.org/licenses/mit-license.php'
  },
  githubUrl: 'https://github.com/bigslycat/pbem'
};

let renderedMarkup = pbem.createTemplate('index')
  .local(data)
  .toString();

console.log(renderedMarkup);
