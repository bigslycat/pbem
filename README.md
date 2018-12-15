# PBEM

[![Greenkeeper badge](https://badges.greenkeeper.io/bigslycat/pbem.svg)](https://greenkeeper.io/)

BEM-helper system for Pug (Jade)

## TODO

-   [x] [Precompiling all templates before usage][7]

-   [x] [Custom template file name extensions][15]

-   [x] [Custom delimiters of file/class names][8]

-   [x] [Redefinition levels][10]
        ([examples of using this in BEM][redefinition-levels])

-   [x] [Checking for mixes and modifiers][14] of current block or element
        within the template

-   [x] [Complete pretty-mode][6]

-   [x] [Create block separately][16]

-   [ ] [Precompile to file / load precompiled from file][13]

-   [ ] [Express middleware][12]

-   [ ] [Interface for Gulp][11]

## Installation

Via npm:

```bash
npm install --save pbem
```

## Usage

As an example of basic usage, see the [demo](./demo/). You can run the demo by
command in this module directory:

```bash
npm run demo
```

And rendered template will be displayed in the terminal. Also you can run this
command from your app directory:

```bash
node -e 'require("pbem/demo")'
```

### External API

#### Function `pbem(config)`

Create a namespace. Each namespace contains the custom settings.

-   `Object` **`config`** — Object with params:

    -   `String` **`templateExt`** — Template file name extension.
        Defaut `.pug`

    -   `String` **`viewsDir`** — Directory for main templates.
        Default `path.join(process.cwd(), 'views')`

    -   `String` **`blocksDir`** — Blocks directory.
        Default `path.join(process.cwd(), 'views/blocks')`

    -   `String` **`elementDelimiter`** — Block-element delimiter.
        Default `__`

    -   `String` **`modifierDelimiter`** — (Block|element)-modifier delimiter.
        Default `_`

    -   `String` **`modifierValueDelimiter`** — Modifier-value delimiter.
        Default `_`

    -   `String` **`vordsDelimiter`** — Words delimiter in modifier name and
        value. Default `_`

    -   `Object` **`pugOptions`** — Pug [options][pug-api]

    -   `Object` **`beautify`** — Beautify [options][js-beautify] (works if
        `config.pugOptions.pretty === true`)

    `@returns` `Object` **`namespace`**

```javascript
const pbem = require('pbem');

const mainScope = pbem({
  viewsDir: __dirname + '/views',
  blocksDir: __dirname + '/views/blocks',
  pugOptions: {
    pretty: true
  }
});
```

#### Method `namespace.precompile()`

Precompile all templates in namespace.

`@returns` `Object` **`namespace`**

#### Method `namespace.createTemplate(name[, options])`

Create a main template as an instance of class
[**`Template`**][template].

-   `String` **`name`** — Template file name without extension

-   `Object` **`options`** — Template options with params:

    -   `Object` **`locals`** — Data for rendering

    -   `Boolean` **`debug`** — Debug mode. All private properties and methods
        will be available in property `privates` of Template instance

```javascript
const mainScope = require('pbem')({
  viewsDir: __dirname + '/views'
});

// __dirname + '/views/index.pug'
let indexTemplate = mainScope.createTemplate('index');

// Render template and return as string
indexTemplate.toString();
```

#### Method `namespace.createBlock(name[, options])`

```javascript
const pug = require('pug');
const pbem = require('pbem');

const scope = pbem({
  blocksDir: __dirname + 'views/blocks'
}).precompile();

const separateTemplate = pug.compileFile(__dirname + 'views/page.pug');

let renderedSeparateTemplate = separateTemplate({
  block: scope.createBlock
});
```

### Template API

This API is available in templates.

#### Function `block(name[, options])`

*Available in main template, Block template and Element template.*

Alias of method `Template.prototype.createBlock()`

-   `String` **`name`** — Template file name without extension

-   `Object` **`options`** — Template options with params:

    -   `Object` **`mods`** — Modifiers. Values must be `string` or `true`

    -   `Array,` **`mixes`** — Mixes.

        Mixes format must be:

        ```javascript
        let mixes = [
          // Add two CSS classes: block-1, block-1_modifier_value1
          ['block-1', {modifier: 'value1'}],
          // block-2, block-2__element-2, block-2__element-2_modifier_value2
          ['block-2', 'element-2', {modifier: 'value2'}]
        ];
        ```

        or

        ```javascript
        let mixes = [
          {block: 'block-1', element: 'element-1', mods: { ... }},
          {block: 'block-2', mods: { ... }}
        ];
        ```

    -   `Object` **`data`** — HTML data-attributes

        ```javascript
        let data = {
          // Equal data-ajax-url="/posts/100500"
          ajaxUrl: '/posts/100500'
        };
        ```

    -   `Object` **`attributes`** — Other HTML attributes

    -   `Object` **`locals`** — Data for rendering

    -   `Boolean` **`debug`** — Debug mode. All private properties and methods
        will be available in property `privates` of Template instance

    `@returns` [**`Block`**][block] instance.

#### Function `element(name[, options])`

*Available in Block template and Element template.*

Alias of method `Block.prototype.createElement()` in Block template or
alias of method `Element.prototype.createElement()` in Element template.

-   `String` **`name`** — Element name (part of template file name)

-   `Object` **`options`** — Template options like options of `block()`

    `@returns` [**`Element`**][element] instance.

#### Function `attributes()`

*Available in Block template and Element template.*

Compile HTML attributes of current BEM-entity:

```pug
div&attributes( attributes() )
```

<http://jade-lang.com/reference/attributes/>

#### Method `local(name[, value])`

Adds locals

There is in the [**`Template`**][template], [**`Block`**][block],
[**`Element`**][element]

```javascript
pbem.createTemplate('index')
  .local('var1', 'value1')
  .local('var2', 'value2');
```

```pug
!= block('header').local('title', post.title);
!= block('content').local({text: post.content, date: post.date});
```

#### Methods `mod(name[, value])`, `attr(name[, value])`, `data(name[, value])`

Adds one or many modifiers, attributes or data-attributes

There is in the [**`Block`**][block],
[**`Element`**][element]. Also used, as in the previous case.

#### Method `mix(blockName[, elementName][, modifiers])`

Adds one or many mixes

Add one mix:

```pug
!=  block('header').mix('article', 'info', {compact: true})
```

One mix or many mixes:

```javascript
// As one or many arguments
.mix(['block-1', {mod1: true}], ['block-2', 'element-2', {mod2: 'value'}], ...)
.mix({block: 'block', element: 'element', mods: { ... }}, ...)

// As Array
.mix([{block: 'block-1'}, ['block-2', 'element-2', {mod2: true}], ...])
```

#### Method `isMod(name[, value])`

Checks a modifier of current block/element

```pug
//- Converse type of value to Boolean
isMod('modifier')

//- Strict comparison
isMod('modifier', 'value')
```

#### Method `mod(name)`

Get modifier value

```pug
if isMod('theme')
  | This theme name is #{mod('theme')}
```

[7]: https://github.com/bigslycat/pbem/issues/7 'v1.0.0'
[15]: https://github.com/bigslycat/pbem/issues/15 'v1.0.0'
[8]: https://github.com/bigslycat/pbem/issues/8 'v1.1.0'
[10]: https://github.com/bigslycat/pbem/issues/10 'v2.0.0'
[14]: https://github.com/bigslycat/pbem/issues/14 'v2.2.0'
[6]: https://github.com/bigslycat/pbem/issues/6 'v2.1.0'
[16]: https://github.com/bigslycat/pbem/issues/16 'v2.3.0'
[13]: https://github.com/bigslycat/pbem/issues/13
[12]: https://github.com/bigslycat/pbem/issues/12
[11]: https://github.com/bigslycat/pbem/issues/11

[template]: ./lib/Template.js
[block]: ./lib/Block.js
[element]: ./lib/Element.js

[redefinition-levels]: https://en.bem.info/methodology/filesystem/#examples-of-using-redefinition-levels 'Examples of using redefinition levels on bem.info'

[pug-api]: http://jade-lang.com/api/
[js-beautify]: https://www.npmjs.com/package/js-beautify#css--html
