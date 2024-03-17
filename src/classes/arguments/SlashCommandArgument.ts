import type {APIApplicationCommandOption, ApplicationCommandOptionType} from 'discord-api-types/v10';
import {Argument, ArgumentType, type ArgumentValidatorFunction, type SlashCommandArgumentBuilder} from './Argument.js';

export type SlashCommandArgument<T> = Argument<T> & {
	toSlashCommandArgument: (name: string) => APIApplicationCommandOption;
	options: SlashCommandArgumentBuilder<T>;
};

export class SlashCommandContextArgument<T> {
	/**
	 * The default value of the argument.
	 */
	public defaultValue: T | undefined;
	/**
	 * The description of the argument.
	 */
	public description: string;
	/**
	 * Is the argument optional.
	 */
	public optional: boolean;
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
	 * @param apiType - The API type of the argument.
	 * @param argument - The argument.
	 */
	public constructor(
		public name: string,
		public index: number,
		public apiType: ApplicationCommandOptionType,
		argument: SlashCommandArgument<T>
	) {
		this.validate = argument.validator;
		this.defaultValue = argument.options.defaultValue ?? undefined;
		this.description = argument.options.description ?? '';
		this.optional = argument.options.optional ?? false;
		this.type = argument.type;
	}
}
