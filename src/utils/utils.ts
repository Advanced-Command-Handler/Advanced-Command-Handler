import {Snowflake} from 'discord.js';
import {CommandHandler} from '../CommandHandler.js';

/**
 * @param text
 * @param maxLength
 * @param endTextIfTooLong
 */
export function cutIfTooLong(text: string, maxLength: number, endTextIfTooLong: string = '...'): string {
	return text.length > maxLength ? `${text.substring(0, maxLength - endTextIfTooLong.length)}${endTextIfTooLong}` : text;
}

/**
 * @param object
 * @param value
 */
export function getKeyByValue<O extends {[key: string]: any}>(object: O, value: O[keyof O]): keyof O | undefined {
	return Object.keys(object).find(key => object[key] === value);
}

/**
 * @param id
 */
export function isOwner(id: Snowflake): boolean {
	return CommandHandler.owners?.includes(id);
}

/**
 * @param array
 */
export function random<T extends any>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}
