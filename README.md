# PBEM

BEM-helper system for Pug (Jade)

## Installation

Via npm:

```bash
npm install -S pbem
```

## Usage

```javascript
const pbem = require('pbem');
const path = require('path');

pbem({
  viewsDir: __dirname + './views',
  blocksDir: __dirname + './views/blocks'
})

const index = pbem.createTemplate('index');
```

views/blocks/header.pug:

```pug
header&attributes( attributes() )
  -
    logoOptions = {
      mods: {
        compact: true,
        theme: 'dark'
      },
      mixes: [
      // Block name    Modifiers
        ['image',    { noBorder: true }],
      // Block name    Element Name
        ['header',     'logo']
      ],
      data: {
        dataParam: 'dataValue'
      },
      attributes: {
        title: 'Logo image title'
      },
      locals: {
        localVar1: 'value1',
        localVar2: 'value2'
      }
    }

  != block('logo', logoOptions)

  //- Displays the header__description
  != element('description').local('text', descriptionText)
```
