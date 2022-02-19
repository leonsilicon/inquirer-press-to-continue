import inquirer from 'inquirer';
import PressToContinuePrompt from '~/prompt.js';

inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);
await inquirer.prompt({
	name: 'key',
	pressToContinueMessage: 'Press y to continue...',
	type: 'press-to-continue',
	anyKey: true,
});
