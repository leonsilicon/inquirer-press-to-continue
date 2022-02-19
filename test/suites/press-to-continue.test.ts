import inquirer from 'inquirer';
import mockStdin from 'mock-stdin';
import type { KeyDescriptor } from '~/index.js';
import PressToContinuePrompt from '~/index.js';

const stdin = mockStdin.stdin();

test('anyKey option works', async () => {
	inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);

	setTimeout(() => {
		stdin.send('y');
	}, 500);

	const { key } = await inquirer.prompt<{ key: KeyDescriptor }>({
		name: 'key',
		type: 'press-to-continue',
		anyKey: true,
	});

	expect(key.value).toEqual('y');
});

test('enter option works', async () => {
	inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);

	setTimeout(() => {
		stdin.send('y');
		stdin.send('\n');
	}, 500);

	const { key } = await inquirer.prompt<{ key: KeyDescriptor }>({
		name: 'key',
		type: 'press-to-continue',
		enter: true,
	});

	expect(key.value).toEqual('enter');
});
