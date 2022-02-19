import type { Key } from 'node:readline';

/**
 * Provides a description about a key.
 */
export interface KeyDescriptor {
	/**
	 * The value of the key.
	 */
	value: string;

	/**
	 * The description of the key.
	 */
	key: Key;
}
