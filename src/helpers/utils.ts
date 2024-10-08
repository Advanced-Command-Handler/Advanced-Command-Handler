import {type GuildTextBasedChannel, NewsChannel, type Snowflake, TextChannel} from 'discord.js';
import {CommandHandler} from '../CommandHandler.js';

/**
 * Return the text cut if length is above `maxLength` arg and add `endTextIfTooLong` at the end.
 *
 * @param text - The text to cut if it is too long.
 * @param maxLength - The maximum length required.
 * @param endTextIfTooLong - The end text to add if it is too long.
 * @returns - The text, cut if it was too long.
 */
export function cutIfTooLong(text: string, maxLength: number, endTextIfTooLong: string = '...') {
	return text.length > maxLength ? `${text.substring(0, maxLength - endTextIfTooLong.length)}${endTextIfTooLong}` : text;
}

/**
 * Get a key from a value from an Object.
 *
 * @typeParam O - The object type.
 * @param object - The object to get key from.
 * @param value - The value.
 * @returns - The key of the object if found, else undefined.
 */
export function getKeyByValue<O extends {[key: string]: any}>(object: O, value: O[keyof O]): keyof O | undefined {
	return Object.keys(object).find(key => object[key] === value);
}

/**
 * Test if the ID is in the {@link CommandHandler.owners}.
 *
 * @param id - The ID of the user to debug.
 * @returns - Is the user an owner.
 */
export function isOwner(id: Snowflake) {
	return CommandHandler.owners?.includes(id) ?? false;
}

/**
 * Returns true if the value looks like a Snowflake.
 *
 * @param value
 * @remarks There is no way to identify at 100% if the value is veritable snowflake of something.
 * @returns - Is the value a Snowflake.
 */
export function isSnowflake(value: string): value is Snowflake {
	return /\d{17,19}/.test(value);
}

/**
 * Returns true if the value is a TextChannel or a NewsChannel.
 *
 * @param value - The value you want to test.
 * @returns - Is the value a GuildTextBasedChannel.
 */
export function isTextChannelLike(value: any): value is GuildTextBasedChannel {
	return value instanceof TextChannel || value instanceof NewsChannel;
}

/**
 * Returns a random value from an array.
 *
 * @typeParam T - The array type.
 * @param array - The array to get a random value from.
 * @returns - A random value from the array.
 */
export function random<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * Wait for a certain amount of time.
 *
 * @param ms - The time to wait in milliseconds.
 * @returns - A promise that resolves after the time has passed.
 */
export async function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
