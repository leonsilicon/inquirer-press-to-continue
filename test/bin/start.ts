import inquirer from 'inquirer';

import PressToContinuePrompt from '~/prompt.js';

inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);
await inquirer.prompt({
	name: 'key',
	pressToContinueMessage: 'Press y to continue...',
	type: 'press-to-continue',
	key: 'y'
});

console.log()

await inquirer.prompt({
	name: 'key',
	type: 'press-to-continue',
	enter: true,
});

console.log()

const { key } = await inquirer.prompt({
	name: 'key',
	type: 'press-to-continue',
	anyKey: true
});

console.log()

console.log(`Key pressed: ${JSON.stringify(key)}`)