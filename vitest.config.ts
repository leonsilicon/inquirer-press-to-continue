import { defineConfig } from 'vitest/config';
import { join } from 'desm';

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
