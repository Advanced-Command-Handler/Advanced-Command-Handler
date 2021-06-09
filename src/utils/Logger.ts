import chalk from 'chalk';
import dayjs from 'dayjs';
import * as fs from 'fs';
import * as paths from 'path';
import {inspect} from 'util';

export enum LogLevel {
	OFF = 0,
	ERROR = 1,
	WARNING = 2,
	INFO = 3,
	EVENT = 4,
	LOG = 5,
	DEBUG = 6,
	COMMENT = 7,
	ALL = 7,
}

export const LogType = {
	error: 'red',
	warn: 'yellow',
	info: 'blue',
	event: 'green',
	log: 'default',
	debug: 'white',
	comment: 'gray',
};

export const colors = {
	red: '#b52825',
	orange: '#e76a1f',
	gold: '#deae17',
	yellow: '#eeee23',
	green: '#3ecc2d',
	teal: '#11cc93',
	blue: '#2582ff',
	indigo: '#524cd9',
	violet: '#7d31cc',
	magenta: '#b154cf',
	pink: '#d070a0',
	brown: '#502f1e',
	black: '#000000',
	grey: '#6e6f77',
	white: '#ffffff',
	default: '#cccccc',
};

export type ColorResolvable = NonNullable<keyof typeof colors | keyof typeof LogType | string>;

export type LoggerIgnore = [title: string, level: LogLevel | keyof typeof LogLevel];

export class Logger {
	/**
	 * Let you set the minimum level required for a log to be sent to console.<br><br>
	 * For example if you set the level to `LogLevel.LOG`, the `Logger.debug()` and `Logger.comments()` methods won't log anything.
	 */
	public static LEVEL: LogLevel = LogLevel.ALL;
	/**
	 * Let you ignore Logs by title or by titles and levels.
	 *
	 * @example
	 * // This will ignore any logs with the title 'mylogs'.
	 * Logger.ignores.push('mylogs');
	 *
	 * // This will ignore any logs with the title 'mylogs', and the level 'LOG' or less.
	 * Logger.ignores.push(['mylogs', LogLevel.LOG]);
	 *
	 * // It can also work by setting the string version of the LogLevel.
	 * Logger.ignores.push(['mylogs', 'LOG']);
	 */
	public static ignores: Array<string | LoggerIgnore> = [];

	private static savingFiles: string[] = [];

	/**
	 * @remarks
	 * Avoid using it because you can't do anything with it.
	 */
	private constructor() {}

	public static saveInFile(path: string) {
		const file = paths.resolve(process.cwd(), path);

		if (!fs.existsSync(file)) {
			Logger.comment(
				`File ${Logger.setColor('violet', file)} ${Logger.setColor('comment', `not found, creating new one, logs will be saved into it.`)}`,
				'LoggingWriter'
			);
			fs.appendFileSync(file, '');
		} else {
			Logger.comment(`File ${Logger.setColor('violet', file)} ${Logger.setColor('comment', `found, logs will be saved into it.`)}`, 'LoggingWriter');
		}
		Logger.savingFiles.push(file);
	}

	/**
	 * Log a message in the console as a comment.
	 *
	 * @remarks
	 * Using the grey color.
	 * @param message - The message to log, can be anything.
	 * @param title - The title of the log.
	 */
	public static comment(message: any, title: string = 'comment'): void {
		if (Logger.LEVEL < LogLevel.COMMENT || Logger.isIgnored(title, LogLevel.COMMENT)) return;
		Logger.process(message, LogType.comment, title);
	}

	/**
	 * Log a message in the console as an error.
	 *
	 * @remarks
	 * Using the red color.
	 * @param message - The message to log, can be anything.
	 * @param title - The title of the log.
	 */
	public static error(message: any, title: string = 'error'): void {
		if (Logger.LEVEL < LogLevel.ERROR || Logger.isIgnored(title, LogLevel.ERROR)) return;
		Logger.process(message, LogType.error, title);
	}

	/**
	 * Log a message in the console as an event.
	 *
	 * @remarks
	 * Using the green color.
	 * @param message - The message to log, can be anything.
	 * @param title - The title of the log.
	 */
	public static event(message: any, title: string = 'event'): void {
		if (Logger.LEVEL < LogLevel.EVENT || Logger.isIgnored(title, LogLevel.EVENT)) return;
		Logger.process(message, LogType.event, title);
	}

	/**
	 * Log a message in the console as an info.
	 *
	 * @remarks
	 * Using the blue color.
	 * @param message - The message to log, can be anything.
	 * @param title - The title of the log.
	 */
	public static info(message: any, title: string = 'info'): void {
		if (Logger.LEVEL < LogLevel.INFO || Logger.isIgnored(title, LogLevel.INFO)) return;
		Logger.process(message, LogType.info, title);
	}

	/**
	 * Log a message in the console.
	 *
	 * @remarks
	 * Using the # color.
	 * @param message - The message to log, can be anything.
	 * @param title - The title of the log.
	 * @param color - The color of the log.
	 */
	public static log(message: any, title: string = 'log', color: ColorResolvable = LogType.log): void {
		if (Logger.LEVEL < LogLevel.LOG || Logger.isIgnored(title, LogLevel.LOG)) return;
		Logger.process(message, color, title);
	}

	public static setColor(color: ColorResolvable = colors.default, text: string = ''): string {
		let finalColor: chalk.Chalk;
		if ((color = this.getColorFromColorResolvable(color))) finalColor = chalk.hex(color);
		else throw new Error('Waiting for a log type, color or HexColor but receive something else.');

		return text ? finalColor(text) : finalColor();
	}

	/**
	 * Log a message in the console as a debug.
	 *
	 * @remarks
	 * Using the default color.
	 * @param message - The message to log, can be anything.
	 * @param title - The title of the log.
	 */
	public static debug(message: any, title: string = 'debug'): void {
		if (Logger.LEVEL < LogLevel.DEBUG || Logger.isIgnored(title, LogLevel.DEBUG)) return;
		Logger.process(message, LogType.debug, title);
	}

	/**
	 * Log a message in the console as a warning.
	 *
	 * @remarks
	 * Using the yellow color.
	 * @param message - The message to log, can be anything.
	 * @param title - The title of the log.
	 */
	public static warn(message: any, title: string = 'warn'): void {
		if (Logger.LEVEL < LogLevel.WARNING) return;
		Logger.process(message, LogType.warn, title);
	}

	/**
	 * Test if a title and level is ignored.
	 *
	 * @param title - The title of the log.
	 * @param level - The level of the log.
	 * @returns - Is it ignored or not.
	 * @internal
	 */
	public static isIgnored(title: string, level: LogLevel) {
		const ignores: LoggerIgnore[] = Logger.ignores.map(s => (typeof s === 'string' ? [s, LogLevel.ALL] : [s[0], s[1]]));
		return ignores.filter(i => i[0].toUpperCase() === title.toUpperCase()).some(i => (typeof i[1] === 'string' ? LogLevel[i[1]] >= level : i[1] >= level));
	}

	/**
	 * Log something in the console and transform the ColorResolvable into an ASCII Escape Sequence containing the color.
	 *
	 * @param text - The text to log.
	 * @param color - The color of the text.
	 * @param title - The title of the text.
	 * @internal
	 */
	protected static process(text: any, color: ColorResolvable = 'debug', title: string = ''): void {
		if (Logger.LEVEL === LogLevel.OFF) return;
		const datePart = `[${dayjs().format('YYYY/MM/DD HH:mm:ss.SSS')}]`;
		const titlePart = `[${title.toUpperCase()}]`;
		let textPart = text;

		text = typeof text === 'string' ? text : inspect(text);
		text = text.replace(/(?<![;\d])\d+(\.\d+)?(?!;|\d)/g, (match: string): string => chalk.yellow(match));
		text = text.replace(/\u001b\[\u001b\[33m39\u001b\[39mm/gi, chalk.reset());

		color = propertyInEnum(LogType, color) ?? color;
		text = `${Logger.setColor('#847270', datePart)}${Logger.setColor(color, `${titlePart} ${text + chalk.reset()}`)}`;
		console.log(text);
		Logger.savingFiles.forEach((s, index) => {
			if (!fs.existsSync(s)) {
				Logger.savingFiles.slice(index, 1);
				Logger.warn(
					`File ${Logger.setColor('violet', s)} ${Logger.setColor('comment', `not found, removed from files to save logs.`)}`,
					'LoggingWriter'
				);
			} else {
				textPart = textPart.replace(/\[(\d{1,3};){0,6}\d{1,3}m/gm, '');
				fs.appendFileSync(s, `${datePart}${titlePart} ${textPart}\n`);
			}
		});
	}

	/**
	 * Returns a color in hexadecimal without the sharp from a ColorResolvable.
	 *
	 * @remarks
	 * Returns the default color if it cannot be resolved.
	 * @param color - The ColorResolvable.
	 * @returns - The color.
	 * @internal
	 */
	private static getColorFromColorResolvable(color: ColorResolvable): string {
		return (
			propertyInEnum(LogType, propertyInEnum(colors, color) ?? '') ??
			propertyInEnum(colors, color) ??
			propertyInEnum(LogType, color)?.match(/#[0-9|a-f]{6}/i)?.[0] ??
			color.match(/#[0-9|a-f]{6}/i)?.[0] ??
			colors.default.substring(1, 7)
		);
	}
}

/**
 * Get the value of an enum.
 *
 * @typeParam V - An object.
 * @param enumObject - The enum as an object.
 * @param property - The property to get.
 * @returns - The value from the key of the enum or undefined if not found.
 * @internal
 */
function propertyInEnum<V extends {[k: string]: any}>(enumObject: V, property: string): keyof V | undefined {
	return enumObject[property] ?? undefined;
}
