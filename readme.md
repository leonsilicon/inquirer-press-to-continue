# inquirer-press-to-continue

[![npm version](https://badge.fury.io/js/inquirer-press-to-continue.svg)](https://badge.fury.io/js/inquirer-press-to-continue)

## Installation

Make sure you have inquirer installed:

```shell
pnpm add inquirer
```

Then, install `inquirer-press-to-continue` from npm using your package manager (I recommend [pnpm](https://pnpm.io/)):

```shell
pnpm add inquirer-press-to-continue
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
});

console.log(anyKey.value);
```
