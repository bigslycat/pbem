# PBEM

BEM-helper system for Pug (Jade)

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
command from yor app directory:

```bash
node -e 'require("pbem/demo/demo")'
```

### External API

#### `pbem(config)`

Overriding the default settings.

-   `Object` **`config`** — Object with params:

    -   `String` **`viewsDir`** — Directory for main templates.
        Default `path.join(process.cwd(), 'views')`

    -   `String` **`blocksDir`** — Blocks directory.
        Default `path.join(process.cwd(), 'views/blocks')`

    -   `Object` **`pugOptions`** — Pug [options](http://jade-lang.com/api/)

    `@returns` **`pbem()`**

```javascript
const pbem = require('pbem');

pbem({
  viewsDir: __dirname + '/views',
  blocksDir: __dirname + '/views/blocks',
  pugOptions: {
    pretty: true
  }
});
```

#### `pbem.createTemplate(name[, options])`

Create a main template as an instance of class [`Template`](./lib/Template.js).

-   `String` **`name`** — Template file name without extension

-   `Object` **`options`** — Template options with params:

    -   `Object` **`locals`** — Data for rendering

    -   `Object` **`pugOptions`** — Owerwrite pug options for template

    -   `Boolean` **`debug`** — Debug mode. All private properties and methods
        will be available in property `privates` of Template instance

```javascript
const pbem = require('pbem')({
  viewsDir: __dirname + '/views'
});

// __dirname + '/views/index.pug'
let indexTemplate = pbem.createTemplate('index');

// Render template and return as string
indexTemplate.toString();
```

### Template API

This API is available in templates.

#### Into main template, Block template and Element template

##### Function `attributes()`

Compile HTML attributes of current BEM-entity:

```pug
div&attributes( attributes() )
```

<http://jade-lang.com/reference/attributes/>

##### Function `block(name[, options])`

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

    -   `Object` **`pugOptions`** — Owerwrite pug options for template

    -   `Boolean` **`debug`** — Debug mode. All private properties and methods
        will be available in property `privates` of Template instance

    `@returns` [`Block`](./lib/Block.js) instance.

#### Into Block template and Element template

##### Function `element(name[, options])`

Alias of method `Block.prototype.createElement()` in Block template or
alias of method `Element.prototype.createElement()` in Element template.

-   `String` **`name`** — Element name (part of template file name)

-   `Object` **`options`** — Template options like options `block()`

    `@returns` [`Block`](./lib/Block.js) instance.
