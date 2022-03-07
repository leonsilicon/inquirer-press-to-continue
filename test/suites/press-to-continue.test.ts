import inquirer from 'inquirer';
import { test, expect, afterAll } from 'vitest';
import * as mockProcess from 'vitest-mock-process';
import type { KeyDescriptor } from '~/index.js';
import PressToContinuePrompt from '~/index.js';

test('custom message works', async () => {
	const mockStdout = mockProcess.mockProcessStdout();
	process.stdin.send('y');

	afterAll(() => {
		mockStdout.mockRestore();
	});

	inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);

	setTimeout(() => {
		expect(
			mockStdout.mock.calls.some((call) =>
				call[0]?.toString().includes('Press y to continue...')
			)
		).toBe(true);
		process.stdin.send('y');
	}, 500);

	const { key } = await inquirer.prompt<{ key: KeyDescriptor }>({
		name: 'key',
		pressToContinueMessage: 'Press y to continue...',
		type: 'press-to-continue',
		anyKey: true,
	});

	expect(key.value).toEqual('y');
});

test('custom message works', async () => {
	const mockStdout = mockProcess.mockProcessStdout();

	afterAll(() => {
		mockStdout.mockRestore();
	});

	inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);

	setTimeout(() => {
		expect(
			mockStdout.mock.calls.some((call) =>
				call[0]?.toString().includes('Press y to continue...')
			)
		).toBe(true);
		process.stdin.send('y');
	}, 500);

	const { key } = await inquirer.prompt<{ key: KeyDescriptor }>({
		name: 'key',
		pressToContinueMessage: 'Press y to continue...',
		type: 'press-to-continue',
		anyKey: true,
	});

	expect(key.value).toEqual('y');
});

test('anyKey option works', async () => {
	inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);

	setTimeout(() => {
		process.stdin.send('y');
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
		process.stdin.send('y');
		process.stdin.send('\n');
	}, 500);

	const { key } = await inquirer.prompt<{ key: KeyDescriptor }>({
		name: 'key',
		type: 'press-to-continue',
		enter: true,
	});

	expect(key.value).toEqual('enter');
});

test('custom key support with string works', async () => {
	inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);

	setTimeout(() => {
		process.stdin.send('x');
		process.stdin.send('y');
	}, 500);

	const { key } = await inquirer.prompt<{ key: KeyDescriptor }>({
		name: 'key',
		pressToContinueMessage: 'Press y to continue...',
		type: 'press-to-continue',
		key: 'y',
	});

	expect(key.value).toEqual('y');
});
