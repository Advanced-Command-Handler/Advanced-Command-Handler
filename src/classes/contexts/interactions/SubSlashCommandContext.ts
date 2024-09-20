import {CommandArgument, type SlashCommandArguments} from '../../arguments/CommandArgument.js';
import type {SlashCommandArgument} from '../../arguments/SlashCommandArgument.js';
import type {SlashCommand, SubSlashCommand} from '../../interactions/SlashCommand.js';
import {SlashCommandContext, type SlashCommandContextBuilder} from './SlashCommandContext.js';

/**
 * The options of the SubSlashCommandContext.
 */
export interface SubSlashCommandContextBuilder<T extends SubSlashCommand<A>, A extends SlashCommandArguments = T['arguments']>
	extends SlashCommandContextBuilder<SlashCommand> {
	subCommand: T;
}

/**
 * The context of a sub slash command.
 */
export class SubSlashCommandContext<T extends SubSlashCommand<A>, A extends SlashCommandArguments = T['arguments']> extends SlashCommandContext<SlashCommand> {
	public subCommand: T;

	/**
	 * Creates a new SubSlashCommandContext.
	 *
	 * @param options - The options of the SubSlashCommandContext.
	 */
	public constructor(options: SubSlashCommandContextBuilder<T>) {
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
	public override argument<K extends keyof A>(name: K) {
		return this.resolveArgument(name) ?? null;
	}

	/**
	 * Resolves one of the argument.
	 *
	 * @typeParam T - The type of the argument.
	 * @param name - The name of the argument.
	 * @returns - The result of the argument maybe in a promise or undefined if no arguments with this name exists or the subCommand has no arguments.
	 */
	public override resolveArgument<K extends keyof A, S = A[K]>(name: K) {
		const subCommand = this.interaction.options.data.find(s => (s.type === 'SUB_COMMAND' || s.type === 'SUB_COMMAND_GROUP') &&
			this.command.subCommandGroups.map(g => g.name).includes(s.name));
		if (subCommand?.type === 'SUB_COMMAND_GROUP') {
			const nestedSubCommand = subCommand.options?.find(o => o.type === 'SUB_COMMAND' && o.name === this.subCommand.name);
			return nestedSubCommand?.options?.find(o => o.name === name)?.value as S extends SlashCommandArgument<infer T, any>
			                                                                       ? T
			                                                                       : undefined;
		}
		return subCommand?.options?.find(o => o.name === name)?.value as S extends SlashCommandArgument<infer T, any> ? T : undefined;
	}

	/**
	 * Resolves all of the arguments of the subCommand.
	 *
	 * @typeParam T - The type of the arguments as an union.
	 * @returns - A map of arguments or undefined if the subCommand has no arguments.
	 */
	public override resolveArguments() {
		const result = new Map<keyof A & string, A[keyof A]>();
		for (const [name] of Object.entries(this.subCommand.arguments)) {
			const value = this.resolveArgument(name);
			if (!value) continue;
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
