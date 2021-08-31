import {ArgumentContext} from '../contexts';

type ArgumentValidator = (argument: string, ctx: ArgumentContext) => boolean;
type ArgumentParser<T> = (argument: string, ctx: ArgumentContext) => T | null | Promise<T | null>;

export type ArgumentFunction<T> = (options: ArgumentBuilder<T>) => Argument<T>;

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
	public coalescing: boolean;
	public defaultValue: T | undefined;
	public description: string;
	public optional: boolean;
	public parse: ArgumentParser<T>;
	public type: ArgumentType;
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

	public get isSimple() {
		return !this.optional && !this.coalescing && !this.defaultValue;
	}
}
