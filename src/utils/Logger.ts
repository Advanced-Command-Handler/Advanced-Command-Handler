import chalk from 'chalk';
import dayjs from 'dayjs';
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

export class Logger {
	public static LEVEL: LogLevel = LogLevel.ALL;
	public static ignores: string[] = [];

	/**
	 * @remarks
	 * Avoid using it because you can't do anything with it.
	 */
	private constructor() {}

	/**
	 * Log a message in the console as a comment.
	 *
	 * @remarks
	 * Using the grey color.
	 * @param message - The message to log, can be anything.
	 * @param title - The title of the log.
	 */
	public static comment(message: any, title: string = 'comment'): void {
		if (Logger.LEVEL < LogLevel.COMMENT) return;
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
		if (Logger.LEVEL < LogLevel.ERROR) return;
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
		if (Logger.LEVEL < LogLevel.EVENT) return;
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
		if (Logger.LEVEL < LogLevel.INFO) return;
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
		if (Logger.LEVEL < LogLevel.LOG) return;
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
		if (Logger.LEVEL < LogLevel.DEBUG) return;
		Logger.process(message, LogType.debug, title);
	}

	/**
	 * Log a message in the console as a warn.
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
	 * Log something in the console and transform the ColorResolvable into a ASCII Escape Sequence containing the color.
	 *
	 * @param text - The text to log.
	 * @param color - The color of the text.
	 * @param title - The title of the text.
	 * @internal
	 */
	protected static process(text: any, color: ColorResolvable = 'debug', title: string = ''): void {
		if (Logger.LEVEL === LogLevel.OFF) return;
		if (Logger.ignores.map(s => s.toUpperCase()).includes(title.toUpperCase())) return;

		text = typeof text === 'string' ? text : inspect(text);
		text = text.replace(/(?<![;\d])\d+(\.\d+)?(?!;|\d)/g, (match: string): string => chalk.yellow(match));
		text = text.replace(/\u001b\[\u001b\[33m39\u001b\[39mm/gi, chalk.reset());

		color = propertyInEnum(LogType, color) ?? color;
		text = `${Logger.setColor('#847270', `[${dayjs().format('YYYY/MM/DD HH:mm:ss.SSS')}]`)}${Logger.setColor(
			color,
			`[${title.toUpperCase()}] ${text + chalk.reset()}`
		)}`;
		console.log(text);
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
