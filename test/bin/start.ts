import inquirer from 'inquirer';
import PressToContinuePrompt from '~/prompt.js';

inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);
await inquirer.prompt({
	name: 'key',
	type: 'press-to-continue',
	anyKey: true,
});
