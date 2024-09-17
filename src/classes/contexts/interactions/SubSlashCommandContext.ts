import {CommandArgument} from '../../arguments/CommandArgument.js';
import type {SubSlashCommand} from '../../interactions/SlashCommand.js';
import {SlashCommandContext, type SlashCommandContextBuilder} from './SlashCommandContext.js';

/**
 * The options of the SubSlashCommandContext.
 */
export interface SubSlashCommandContextBuilder extends SlashCommandContextBuilder {
	subCommand: SubSlashCommand;
}

/**
 * The context of a sub slash command.
 */
export class SubSlashCommandContext extends SlashCommandContext {
	public subCommand: SubSlashCommand;

	/**
	 * Creates a new SubSlashCommandContext.
	 *
	 * @param options - The options of the SubSlashCommandContext.
	 */
	public constructor(options: SubSlashCommandContextBuilder) {
		super(options);
		this.subCommand = options.subCommand;
	}

	/**
	 * Returns the list of arguments of the SubCommand.
	 */
	override get arguments() {
		return Object.entries(this.subCommand.arguments).map((a, index) => new CommandArgument(a[0], index, a[1]));
	}

	/**
	 * Returns an argument.
	 * If the argument is errored or not found it will return `null`.
	 *
	 * @typeParam T - The type of the argument.
	 * @param name - The name of the argument.
	 * @returns - The argument in a promise or null if the argument is not found or errored or the command has no arguments.
	 */
	public override argument<T>(name: string | (keyof this['subCommand']['arguments'] & string)): T | null {
		return this.resolveArgument<T>(name) ?? null;
	}

	/**
	 * Resolves one of the argument.
	 *
	 * @typeParam T - The type of the argument.
	 * @param name - The name of the argument.
	 * @returns - The result of the argument maybe in a promise or undefined if no arguments with this name exists or the subCommand has no arguments.
	 */
	public override resolveArgument<T>(name: string | (keyof this['subCommand']['arguments'] & string)): undefined | T {
		return this.interaction.options.data.find(o => o.name === name)?.value as T;
	}

	/**
	 * Resolves all of the arguments of the subCommand.
	 *
	 * @typeParam T - The type of the arguments as an union.
	 * @returns - A map of arguments or undefined if the subCommand has no arguments.
	 */
	public override resolveArguments<T>() {
		const result = new Map<string, T>();
		for (const [name] of Object.entries(this.subCommand.arguments)) {
			const value = this.resolveArgument<T>(name);
			if (value === undefined) continue;
			result.set(name, value);
		}

		return result;
	}

	/**
	 * The description of the subCommand that was executed.
	 */
	get subCommandDescription() {
		return this.subCommand.description;
	}
}
