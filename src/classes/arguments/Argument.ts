import type {APIApplicationCommandBasicOption} from 'discord-api-types/v10';
import type {ArgumentContext} from '../contexts/ArgumentContext.js';
import type {SlashCommandArgument} from './SlashCommandArgument.js';

/**
 * The validator of arguments, must return `true` if the argument is valid.
 */
export type ArgumentValidatorFunction = (argument: string, ctx: ArgumentContext) => boolean;
/**
 * The parser of the arguments, must return a value or `null`, can be in a promise or not.
 */
export type ArgumentParserFunction<T> = (argument: string, ctx: ArgumentContext) => T | null | Promise<T | null>;

/**
 * The slash command argument type.
 */
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
export type SlashCommandArgumentBuilder<T> = Partial<DefaultValueArgument<T> | OptionalArgument> & {description: string};

export interface ArgumentOptions<T> {
	coalescing?: boolean;
	defaultValue?: T;
	description?: string;
	optional?: boolean;
}

export class Argument<T, O extends ArgumentOptions<T> = ArgumentOptions<T>> {
	/**
	 * Creates a new argument.
	 *
	 * @param type - The type of the argument.
	 * @param options - The options of the argument.
	 * @param validator - The validator of the argument.
	 * @param parser - The parser of the argument.
	 * @param toSlashCommandArgument - The function to convert the argument to a JSON representation.
	 * Optional but if provided, the argument will be available as a slash command argument.
	 */
	private constructor(public type: ArgumentType, public options: O,
		public validator: ArgumentValidatorFunction,
		public parser: ArgumentParserFunction<T>,
		public toSlashCommandArgument?: (name: string) => APIApplicationCommandBasicOption
	) {}

	/**
	 * Creates a new argument.
	 *
	 * @param type - The type of the argument.
	 * @param options - The options of the argument.
	 * @param validator - The validator of the argument.
	 * @param parser - The parser of the argument.
	 * @param toSlashCommandArgument - The function to convert the argument to a JSON representation.
	 * Optional but if provided, the argument will be available as a slash command argument.
	 *
	 * @returns - The created argument.
	 */
	public static create<T, O extends ArgumentOptions<T> = ArgumentOptions<T>, F extends ((name: string) => APIApplicationCommandBasicOption) | undefined = (name: string) => APIApplicationCommandBasicOption, >(type: ArgumentType,
		options: O,
		validator: ArgumentValidatorFunction,
		parser: ArgumentParserFunction<T>,
		toSlashCommandArgument?: F
	): F extends (name: string) => APIApplicationCommandBasicOption ? SlashCommandArgument<T, O> : Argument<T, O> {
		return new Argument(type, options, validator, parser, toSlashCommandArgument) as any;
	}

	/**
	 * Is the argument can be used as a slash command argument.
	 *
	 * @returns - Can the argument be used as a slash command argument.
	 */
	public canBeSlashCommandArgument(): this is SlashCommandArgument<T, O> {
		return !!this.toSlashCommandArgument;
	}
}
