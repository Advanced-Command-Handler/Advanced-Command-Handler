import chalk from 'chalk';
import dayjs from 'dayjs';
import {inspect} from 'util';

export const LogType = {
	error: 'red',
	warn: 'yellow',
	info: 'blue',
	event: 'green',
	log: '#43804e',
	test: 'default',
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
	private static logComments: boolean = true;

	public static comment(message: any, title: string = 'comment'): void {
		if (Logger.logComments) {
			Logger.process(message, LogType.comment, title);
		}
	}

	public static error(message: any, title: string = 'error'): void {
		Logger.process(message, LogType.error, title);
	}

	public static event(message: any, title: string = 'event'): void {
		Logger.process(message, LogType.event, title);
	}

	public static info(message: any, title: string = 'info'): void {
		Logger.process(message, LogType.info, title);
	}

	public static log(message: any, title: string = 'log', color: ColorResolvable = LogType.log): void {
		Logger.process(message, color, title);
	}

	public static setColor(color: ColorResolvable = colors.default, text: string = ''): string {
		let finalColor: chalk.Chalk;
		if ((color = this.getColorFromColorResolvable(color))) finalColor = chalk.hex(color);
		else throw new Error('Waiting for a log type, color or HexColor but receive something else.');

		return text ? finalColor(text) : finalColor();
	}

	public static test(message: any, title: string = 'test'): void {
		Logger.process(message, LogType.test, title);
	}

	public static warn(message: any, title: string = 'warn'): void {
		Logger.process(message, LogType.warn, title);
	}

	protected static process(text: any, color: ColorResolvable = 'test', title: string = ''): void {
		text = typeof text === 'string' ? text : inspect(text);
		text = text.replace(/(?<![;\d])\d+(\.\d+)?(?!;|\d)/g, (match: string): string => chalk.yellow(match));
		text = text.replace(/\u001b\[\u001b\[33m39\u001b\[39mm/gi, chalk.reset());

		color = Logger.propertyInEnum(LogType, color) ?? color;
		text = `${Logger.setColor('#847270', `[${dayjs().format('D HH:mm:ss.u')}]`)}${Logger.setColor(color, `[${title.toUpperCase()}] ${text + chalk.reset()}`)}`;
		console.log(text);
	}

	private static getColorFromColorResolvable(colorAfter: string): ColorResolvable {
		return (
			Logger.propertyInEnum(LogType, Logger.propertyInEnum(colors, colorAfter) ?? '') ??
			Logger.propertyInEnum(colors, colorAfter) ??
			Logger.propertyInEnum(LogType, colorAfter)?.match(/#[0-9|a-f]{6}/i)?.[0] ??
			colorAfter.match(/#[0-9|a-f]{6}/i)?.[0] ??
			colors.default
		);
	}

	private static propertyInEnum<V extends {[k: string]: any}>(enumObject: V, property: string): keyof V | undefined {
		return property in enumObject ? enumObject[property] : undefined;
	}
}
