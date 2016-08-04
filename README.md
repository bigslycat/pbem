# PBEM

BEM-helper system for Pug (Jade)

-   [x] Precompiling all templates before usage #7
-   [x] Custom delimiters of file/class names #8
-   [x] [Redefinition levels](https://en.bem.info/methodology/filesystem/#examples-of-using-redefinition-levels) #10
-   [ ] Complete pretty-mode #6
-   [ ] Precompile to file / load precompiled from file #13
-   [ ] Express middleware #12
-   [ ] Interface for Gulp #11

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

    -   `Object` **`pugOptions`** — Pug [options](http://jade-lang.com/api/)

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
[**`Template`**](./lib/Template.js).

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

    `@returns` [**`Block`**](./lib/Block.js) instance.

#### Function `element(name[, options])`

*Available in Block template and Element template.*

Alias of method `Block.prototype.createElement()` in Block template or
alias of method `Element.prototype.createElement()` in Element template.

-   `String` **`name`** — Element name (part of template file name)

-   `Object` **`options`** — Template options like options of `block()`

    `@returns` [**`Element`**](./lib/Element.js) instance.

#### Function `attributes()`

*Available in Block template and Element template.*

Compile HTML attributes of current BEM-entity:

```pug
div&attributes( attributes() )
```

<http://jade-lang.com/reference/attributes/>

#### Method `local(name[, value])`

Adds locals

There is in the [**`Template`**](./lib/Template.js),
[**`Block`**](./lib/Block.js), [**`Element`**](./lib/Element.js)

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

There is in the [**`Block`**](./lib/Block.js),
[**`Element`**](./lib/Element.js). Also used, as in the previous case.

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
