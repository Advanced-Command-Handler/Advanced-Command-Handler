import {Snowflake} from 'discord.js';
import {CommandHandler} from '../CommandHandler.js';

/**
 * Return the text cut if length is above `maxLength` arg and add `endTextIfTooLong` at the end.
 *
 * @param text - The text to cut if it is too long.
 * @param maxLength - The maximum length required.
 * @param endTextIfTooLong - The end text to add if it is too long.
 * @returns The text, cut if it was too long.
 */
export function cutIfTooLong(text: string, maxLength: number, endTextIfTooLong: string = '...'): string {
	return text.length > maxLength ? `${text.substring(0, maxLength - endTextIfTooLong.length)}${endTextIfTooLong}` : text;
}

/**
 * Get a key from a value from an Object.
 *
 * @typeParam O - The object type.
 * @param object - The object to get key from.
 * @param value - The value.
 * @returns The key of the object if found, else undefined.
 */
export function getKeyByValue<O extends {[key: string]: any}>(object: O, value: O[keyof O]): keyof O | undefined {
	return Object.keys(object).find(key => object[key] === value);
}

/**
 * Test if the ID is in the {@link CommandHandler.owners}.
 *
 * @param id - The ID of the user to debug
 * @returns Is the user an owner.
 */
export function isOwner(id: Snowflake): boolean {
	return CommandHandler.owners?.includes(id);
}

/**
 * Returns a random value from an array.
 *
 * @typeParam T - The array type.
 * @param array - The array to get a random value from.
 * @returns A random value from the array.
 */
export function random<T extends any>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}
