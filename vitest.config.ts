import { join } from 'desm';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			'~': join(import.meta.url, 'src'),
		},
	},
	test: {
		deps: {
			inline: [/vitest-mock-process/],
		},
		isolate: true,
		restoreMocks: true,
		mockReset: true,
		clearMocks: true,
	},
});
