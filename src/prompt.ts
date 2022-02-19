/* eslint-disable @typescript-eslint/no-unnecessary-qualifier */

import type { Interface, Key } from 'node:readline';
import deepEqual from 'deep-equal';
import InputPromptBase from 'inquirer/lib/prompts/base.js';
import type inquirer from 'inquirer';
import observe from 'inquirer/lib/utils/events.js';
import type { Answers, Question } from 'inquirer';
import ora from 'ora';
import type { KeyDescriptor } from '~/types.js';

declare module 'inquirer' {
	interface PressToContinuePromptOptions<
		T extends inquirer.Answers = inquirer.Answers
	> extends inquirer.InputQuestionOptions<T> {}

	/**
	 * Provides options for the `PressToContinuePrompt`.
	 *
	 * @template T
	 * The type of the answers.
	 */

	interface PressToContinuePrompt<T extends inquirer.Answers = inquirer.Answers>
		extends PressToContinuePromptOptions<T> {
		/**
		 * @inheritdoc
		 */
		type: 'press-to-continue';

		/**
		 * The key the user should press.
		 */
		key?: string | Key;

		/**
		 * Whether to allow any key to be pressed.
		 */
		anyKey?: boolean;

		/**
		 * Only allow enter to be pressed.
		 */
		enter?: boolean;

		/**
		 * Custom message for the "press to continue" loader
		 */
		pressToContinueMessage?: string;
	}

	interface QuestionMap<T extends inquirer.Answers = inquirer.Answers> {
		/**
		 * The `PressToContinuePrompt` type.
		 */
		pressToContinue: PressToContinuePrompt<T>;
	}
}

class PressToContinuePrompt extends InputPromptBase {
	declare opt: inquirer.prompts.PromptOptions & {
		key: string | Key;
		enter: boolean;
		anyKey: boolean;
		pressToContinueMessage: string;
	};

	spinnerIntervalId: NodeJS.Timeout;

	done: (value: any) => void;

	constructor(questions: Question, rl: Interface, answers: Answers) {
		super(questions, rl, answers);

		if (
			[
				this.opt.anyKey !== undefined,
				this.opt.enter !== undefined,
				this.opt.key !== undefined,
			].filter((option) => option).length !== 1
		) {
			throw new Error(
				'Exactly one of the options `enter`, `key`, or `anyKey` must be set.'
			);
		}
	}

	_run(done: (value: any) => void) {
		this.done = done;

		const events = observe(this.rl);

		events.line.subscribe(() => {
			this._done({
				key: {
					name: 'Enter',
				},
				value: 'enter',
			});
		});

		events.keypress.subscribe((event) => {
			if (this.opt.anyKey) {
				this._done(event);
			} else if (this.opt.enter && event.key.name === 'Enter') {
				this._done(event);
			} else if (
				typeof this.opt.key === 'string' &&
				event.key.name === this.opt.key
			) {
				this._done(event);
			} else if (
				this.opt.key === 'object' &&
				deepEqual(event.key, this.opt.key)
			) {
				this._done(event);
			}
		});

		this.render();

		return this;
	}

	_done(key: KeyDescriptor) {
		if (this.spinnerIntervalId !== undefined) {
			clearInterval(this.spinnerIntervalId);
		}

		this.done(key);
	}

	render() {
		const message =
			this.opt.pressToContinueMessage ??
			`Press ${this.opt.enter ? 'enter' : 'any key'} to continue...`;

		const spinner = ora({
			// Default interval seems a bit glitchy on Alacritty
			interval: 100,
			text: message,
		});

		this.spinnerIntervalId = setInterval(() => {
			this.screen.render(spinner.frame(), '');
		}, spinner.interval);
	}
}

export default PressToContinuePrompt;
