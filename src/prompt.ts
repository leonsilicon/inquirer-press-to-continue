/* eslint-disable @typescript-eslint/no-unnecessary-qualifier */

import type inquirer from 'inquirer';
import type { Answers, Question } from 'inquirer';
import InputPromptBase from 'inquirer/lib/prompts/base.js';
import observe from 'inquirer/lib/utils/events.js';
import type { Interface } from 'node:readline';
import ora, { Ora } from 'ora';

import type { KeyDescriptor } from '~/types.js';

declare module 'inquirer' {
	interface PressToContinuePromptOptions<
		T extends Answers = Answers
	> extends InputQuestionOptions<T> {}

	/**
	 * Provides options for the `PressToContinuePrompt`.
	 *
	 * @template T
	 * The type of the answers.
	 */

	interface PressToContinuePrompt<T extends Answers = Answers>
		extends PressToContinuePromptOptions<T> {
		/**
		 * @inheritdoc
		 */
		type: 'press-to-continue';

		/**
		 * The key the user should press.
		 */
		key?: string;

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

		/**
		 * Custom options to pass to the ora spinner.
		 */
		oraOptions?: Ora;
	}

	interface QuestionMap<T extends Answers = Answers> {
		/**
		 * The `PressToContinuePrompt` type.
		 */
		pressToContinue: PressToContinuePrompt<T>;
	}
}

class PressToContinuePrompt extends InputPromptBase {
	declare opt: inquirer.prompts.PromptOptions & {
		key: string;
		enter: boolean;
		anyKey: boolean;
		pressToContinueMessage: string;
		oraOptions: Ora;
	};

	spinner?: Ora;

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
			// TODO: find a more elegant solution to remove the extra line (the ora spinner artifact) when user presses enter
			process.stderr.moveCursor(0, -1);
			process.stderr.clearLine(1);
			if (this.opt.enter || this.opt.anyKey) {
				this._done({
					key: {
						name: 'Enter',
					},
					value: 'enter',
				});
			}
		});

		events.keypress.subscribe((event) => {
			if (this.opt.anyKey) {
				this._done(event);
			} else if (event.key.name === this.opt.key) {
				this._done(event);
			}
		});

		this.render();

		return this;
	}

	_done(key: KeyDescriptor) {
		if (this.spinner?.isSpinning) {
			const frame = this.spinner.frame();
			this.spinner.stop();
			process.stderr.write(frame);
		}

		this.done(key);
	}

	render() {
		const message =
			this.opt.pressToContinueMessage ??
			`Press ${this.opt.enter ? 'enter' : 'any key'} to continue...`;

		this.spinner = ora({
			...this.opt.oraOptions,
			text: message,
		});

		this.spinner.start();
	}
}

export default PressToContinuePrompt;
