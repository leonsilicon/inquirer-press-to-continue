import path from 'node:path';

const __dirname = new URL('.', import.meta.url).pathname;

/**
 * @type import('ts-jest/dist/types').InitialOptionsTsJest
 */
const config = {
	modulePathIgnorePatterns: ['<rootDir>/dist'],
	setupFiles: ['./test/jest.setup.ts'],
	extensionsToTreatAsEsm: ['.ts'],
	globals: {
		'ts-jest': {
			useESM: true,
			tsconfig: path.join(__dirname, 'test/tsconfig.json'),
		},
	},
	transform: {},
	resolver: 'ts-jest-resolver',
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleNameMapper: {
		'~/(.*)$': '<rootDir>/src/$1',
		'~test/(.*)$': '<rootDir>/test/$1',
		chalk: 'chalk/source/index.js',
		'#ansi-styles': 'chalk/source/vendor/ansi-styles/index.js',
		'#supports-color': 'chalk/source/vendor/supports-color/index.js',
	},
};

export default config;
