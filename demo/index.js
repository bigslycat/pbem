'use strict';

const path = require('path');
const pug = require('pug');
const pbem = require('../pbem');

let mainScope = pbem({
  viewsDir: path.join(__dirname, 'main.views'),
  blocksDir: path.join(__dirname, 'main.views', 'blocks'),
  pugOptions: {
    pretty: true
  }
}).precompile();

let additionalScopeConfig = {
  viewsDir: path.join(__dirname, 'additional.views'),
  blocksDir: path.join(__dirname, 'additional.views', 'blocks')
};

let additionalScope = pbem(additionalScopeConfig).precompile();

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

let renderedMainScopeMarkup = mainScope.createTemplate('index')
  .local(data)
  .toString();

let renderedAdditionalScopeMarkup = additionalScope.createTemplate('page')
  .local('content', data.content)
  .toString();

console.log('renderedMainScopeMarkup:\n');
console.log(renderedMainScopeMarkup + '\n');

console.log('renderedAdditionalScopeMarkup:\n');
console.log(renderedAdditionalScopeMarkup + '\n');

const separateTemplatePath = path.join(
  additionalScopeConfig.viewsDir,
  'page.pug'
);

const separateTemplate = pug.compileFile(separateTemplatePath);

data.block = additionalScope.createBlock;

let renderedSeparateTemplate = separateTemplate(data);

console.log('renderedSeparateTemplate:\n');
console.log(renderedSeparateTemplate + '\n');
