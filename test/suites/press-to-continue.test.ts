import inquirer from 'inquirer';
import mockStdin from 'mock-stdin';
import mockProcess from 'jest-mock-process';
import type { KeyDescriptor } from '~/index.js';
import PressToContinuePrompt from '~/index.js';

test('anyKey option works', async () => {
	const stdin = mockStdin.stdin();

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
	const stdin = mockStdin.stdin();

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

test('custom message works', async () => {
	const stdin = mockStdin.stdin();
	const mockStdout = mockProcess.mockProcessStdout();

	inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);

	setTimeout(() => {
		expect(
			mockStdout.mock.calls.some((call) =>
				call[0].includes('Press y to continue...')
			)
		).toBe(true);
		stdin.send('y');
	}, 500);

	const { key } = await inquirer.prompt<{ key: KeyDescriptor }>({
		name: 'key',
		pressToContinueMessage: 'Press y to continue...',
		type: 'press-to-continue',
		anyKey: true,
	});

	expect(key.value).toEqual('y');
});
