import {ArgumentContext} from '../contexts';

/**
 * The validator of arguments, must return `true` if the argument is valid.
 */
type ArgumentValidator = (argument: string, ctx: ArgumentContext) => boolean;
/**
 * The parser of the arguments, must return a value or `null`, can be in a promise or not.
 */
type ArgumentParser<T> = (argument: string, ctx: ArgumentContext) => T | null | Promise<T | null>;

export type ArgumentFunction<T> = (options: ArgumentBuilder<T>) => Argument<T>;

/**
 * The arguments types.
 * You can add your own if you want to add arguments types.
 */
export enum ArgumentType {
	BOOLEAN = 'boolean',
	CHANNEL = 'channel',
	COMMAND = 'command',
	CHOICE = 'choice',
	EMOJI = 'emoji',
	ENUM = 'enum',
	EVENT = 'event',
	FLOAT = 'float',
	GUILD = 'guild',
	GUILD_MEMBER = 'guild_member',
	INTEGER = 'integer',
	MESSAGE = 'message',
	REGEX = 'regex',
	ROLE = 'role',
	SNOWFLAKE = 'snowflake',
	STRING = 'string',
	TEXT_CHANNEL = 'text_channel',
	USER = 'user',
}

type DefaultValueArgument<T> = {defaultValue: T};
type CoalescingArgument = {coalescing: boolean};
type OptionalArgument = {optional: boolean};
export type ArgumentBuilder<T> = Partial<(DefaultValueArgument<T> | CoalescingArgument | OptionalArgument) & {description: string}>;

export interface ArgumentOptions<T> {
	coalescing?: boolean;
	defaultValue?: T;
	description?: string;
	optional?: boolean;
}

export class Argument<T> {
	public constructor(public type: ArgumentType, public options: ArgumentOptions<T>, public validator: ArgumentValidator, public parser: ArgumentParser<T>) {}
}

export class CommandArgument<T> {
	/**
	 * Does the argument can take multiple words.
	 */
	public coalescing: boolean;
	/**
	 * The default value of the argument.
	 */
	public defaultValue: T | undefined;
	/**
	 * The description of the argument, currently not used anywhere.
	 */
	public description: string;
	/**
	 * Is the argument optional or not.
	 */
	public optional: boolean;
	/**
	 * The parse function of the argument.
	 */
	public parse: ArgumentParser<T>;
	/**
	 * The type of the argument.
	 */
	public type: ArgumentType;
	/**
	 * The validate function of the argument.
	 */
	public validate: ArgumentValidator;

	public constructor(public name: string, public index: number, argument: Argument<T>) {
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
	 * @returns - Does the argument can be skipped.
	 */
	public get isSkipable() {
		return this.optional || !!this.defaultValue;
	}
}
