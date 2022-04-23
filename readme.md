# inquirer-press-to-continue

[![npm version](https://img.shields.io/npm/v/inquirer-press-to-continue)](https://npmjs.com/package/inquirer-press-to-continue)

<p align='center'>
  <img src='https://raw.githubusercontent.com/leonzalion/inquirer-press-to-continue/main/assets/demo.gif' />
</p>

## Installation

Make sure you have inquirer installed:

```shell
npm install inquirer
```

Then, install `inquirer-press-to-continue`:

```shell
npm install inquirer-press-to-continue
```

## Usage

```typescript
import inquirer from 'inquirer';
import PressToContinuePrompt from 'inquirer-press-to-continue';
import type { KeyDescriptor } from 'inquirer-press-to-continue';

inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);

const { key: enterKey } = await inquirer.prompt<{ key: KeyDescriptor }>({
  name: 'key',
  type: 'press-to-continue',
  enter: true,
});

console.log(enterKey.value); // "enter"

const { key: anyKey } = await inquirer.prompt<{ key: KeyDescriptor }>({
  name: 'key',
  type: 'press-to-continue',
  anyKey: true,
  pressToContinueMessage: 'Press a key to continue...',
});

console.log(anyKey.value);
```

## API

### key

Type: `string`

The key the user should press to continue.

### anyKey

Type: `boolean`

Whether to allow the user to press any key to continue.

### enter

Type: `boolean`

Only allow the enter key to be pressed.

### pressToContinueMessage

Type: `string`

Custom message for prompting the user to press a key to continue.
