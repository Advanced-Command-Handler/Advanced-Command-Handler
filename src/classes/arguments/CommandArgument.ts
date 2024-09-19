import {Argument, type ArgumentParserFunction, ArgumentType, type ArgumentValidatorFunction} from './Argument.js';
import type {SlashCommandArgument} from './SlashCommandArgument.js';

export class CommandArgument<T> {
	/**
	 * Can the argument take multiple words.
	 */
	public coalescing: boolean;
	/**
	 * The default value of the argument.
	 */
	public defaultValue: T | undefined;
	/**
	 * The description of the argument, currently not used for chat commands.
	 */
	public description: string;
	/**
	 * Is the argument optional.
	 */
	public optional: boolean;
	/**
	 * The parse function of the argument.
	 */
	public parse: ArgumentParserFunction<T>;
	/**
	 * The type of the argument.
	 */
	public type: ArgumentType;
	/**
	 * The validate function of the argument.
	 */
	public validate: ArgumentValidatorFunction;

	/**
	 * Creates a new command argument.
	 *
	 * @param name - The name of the argument.
	 * @param index - The index of the argument.
	 * @param argument - The argument.
	 */
	public constructor(
		public name: string,
		public index: number,
		argument: Argument<T>
	) {
		this.validate = argument.validator;
		this.coalescing = argument.options.coalescing ?? false;
		this.defaultValue = argument.options.defaultValue ?? undefined;
		this.description = argument.options.description ?? '';
		this.optional = argument.options.optional ?? false;
		this.type = argument.type;
		this.parse = argument.parser;
	}

	/**
	 * Is the argument not optional, doesn't have any default value and only takes one word.
	 *
	 * @returns - Is the argument simple.
	 */
	public get isSimple() {
		return !this.optional && !this.coalescing && !this.defaultValue;
	}

	/**
	 * Is the argument optional or has a default value.
	 *
	 * @returns - Can the argument be skipped.
	 */
	public get isSkipable() {
		return this.optional || !!this.defaultValue;
	}
}

export type SlashCommandArguments = Record<string, SlashCommandArgument<any, any>>;
