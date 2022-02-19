/* eslint-disable @typescript-eslint/no-unnecessary-qualifier */

import type { Interface } from 'node:readline';
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
		 * Whether to allow any key to be pressed.
		 */
		anyKey?: boolean;

		/**
		 * Only allow enter to be pressed.
		 */
		enter?: boolean;
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
		enter: boolean;
		anyKey: boolean;
	};

	spinnerIntervalId: NodeJS.Timeout;

	done: (value: any) => void;

	constructor(questions: Question, rl: Interface, answers: Answers) {
		super(questions, rl, answers);

		if (this.opt.enter && this.opt.anyKey) {
			throw new Error('Only one of enter or anyKey can be set to true.');
		}

		// By default, we use "Press any key to continue..."
		if (this.opt.enter) {
			this.opt.anyKey = false;
			this.opt.enter = true;
		} else {
			this.opt.anyKey = true;
			this.opt.enter = false;
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
		const spinner = ora({
			// Default interval seems a bit glitchy on Alacritty
			interval: 100,
			text: `Press ${this.opt.enter ? 'enter' : 'any key'} to continue...`,
		});

		this.spinnerIntervalId = setInterval(() => {
			this.screen.render(spinner.frame(), '');
		}, spinner.interval);
	}
}

export default PressToContinuePrompt;
