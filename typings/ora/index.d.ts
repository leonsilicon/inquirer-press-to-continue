// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as ora from 'ora';

declare module 'ora' {
	export interface Ora {
		readonly interval: number;
	}
}
