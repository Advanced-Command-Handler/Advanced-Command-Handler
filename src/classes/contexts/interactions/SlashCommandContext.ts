import type {CommandInteraction} from 'discord.js';

import {CommandArgument} from '../../arguments/CommandArgument.js';
import type {SlashCommand} from '../../interactions/SlashCommand.js';
import {ApplicationCommandContext, type ApplicationCommandContextBuilder} from './ApplicationCommandContext.js';

/**
 * The options of the SlashCommandContext.
 */
export interface SlashCommandContextBuilder extends ApplicationCommandContextBuilder<SlashCommand> {
	interaction: CommandInteraction;
}

/**
 * The context of a slash command.
 */
export class SlashCommandContext extends ApplicationCommandContext<SlashCommand> {
	override interaction: CommandInteraction;

	/**
	 * Creates a new SlashCommandContext.
	 *
	 * @param options - The options of the SlashCommandContext.
	 */
	public constructor(options: SlashCommandContextBuilder) {
		super(options);
		this.command = options.command;
		this.interaction = options.interaction;
		this.interactionHandler = options.interactionHandler;
	}

	/**
	 * The arguments of the command.
	 */
	get arguments() {
		return Object.entries(this.command.arguments).map((a, index) => new CommandArgument(a[0], index, a[1]));
	}

	/**
	 * The description of the command that was executed.
	 */
	get commandDescription() {
		return this.command.description;
	}

	/**
	 * Returns an argument.
	 * If the argument is errored or not found it will return `null`.
	 *
	 * @typeParam T - The type of the argument.
	 * @param name - The name of the argument.
	 * @returns - The argument in a promise or null if the argument is not found or errored or the command has no arguments.
	 */
	public argument<T>(name: string | (keyof this['command']['arguments'] & string)): T | null {
		return this.resolveArgument<T>(name) ?? null;
	}

	/**
	 * Is the command calling a sub command.
	 *
	 * @returns - Is the command calling a sub command.
	 */
	public isCallingSubCommand() {
		return this.interaction.options.getSubcommandGroup(false) !== null || this.interaction.options.getSubcommand(false) !== null;
	}

	/**
	 * Resolves one of the argument.
	 *
	 * @typeParam T - The type of the argument.
	 * @param name - The name of the argument.
	 * @returns - The result of the argument maybe in a promise or undefined if no arguments with this name exists or the command has no arguments.
	 */
	public resolveArgument<T>(name: string | (keyof this['command']['arguments'] & string)): undefined | T {
		return this.interaction.options.data.find(o => o.name === name)?.value as T;
	}

	/**
	 * Resolves all of the arguments of the command.
	 *
	 * @typeParam T - The type of the arguments as an union.
	 * @returns - A map of arguments or undefined if the command has no arguments.
	 */
	public resolveArguments<T>() {
		const result = new Map<string, T>();
		for (const [name] of Object.entries(this.command.arguments)) {
			const value = this.resolveArgument<T>(name);
			if (value === undefined) continue;
			result.set(name, value);
		}

		return result;
	}
}
