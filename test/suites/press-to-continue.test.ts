import inquirer from 'inquirer';
import { test, expect, afterAll } from 'vitest';
import * as mockProcess from 'vitest-mock-process';
import * as mockStdin from 'mock-stdin';
import type { KeyDescriptor } from '~/index.js';
import PressToContinuePrompt from '~/index.js';

test('custom message works', async () => {
	const mockStdout = mockProcess.mockProcessStdout();
	const stdin = mockStdin.stdin();

	afterAll(() => {
		mockStdout.mockRestore();
		stdin.restore();
	});

	inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);

	setTimeout(() => {
		expect(
			mockStdout.mock.calls.some((call) =>
				call[0]?.toString().includes('Press y to continue...')
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

// eslint-disable-next-line no-warning-comments
// TODO: figure out why the following test, when repeated, doesn't work
test.todo('custom message works', async () => {
	const mockStdout = mockProcess.mockProcessStdout();
	const stdin = mockStdin.stdin();

	afterAll(() => {
		mockStdout.mockRestore();
		stdin.restore();
	});

	inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);

	setTimeout(() => {
		expect(
			mockStdout.mock.calls.some((call) =>
				call[0]?.toString().includes('Press y to continue...')
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

test('anyKey option works', async () => {
	const stdin = mockStdin.stdin();

	afterAll(() => {
		stdin.restore();
	});

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

	afterAll(() => {
		stdin.restore();
	});

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

test('custom key support with string works', async () => {
	const stdin = mockStdin.stdin();

	afterAll(() => {
		stdin.restore();
	});

	inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);

	setTimeout(() => {
		stdin.send('x');
		stdin.send('y');
	}, 500);

	const { key } = await inquirer.prompt<{ key: KeyDescriptor }>({
		name: 'key',
		pressToContinueMessage: 'Press y to continue...',
		type: 'press-to-continue',
		key: 'y',
	});

	expect(key.value).toEqual('y');
});
