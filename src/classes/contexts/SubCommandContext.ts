import {ArgumentParser, type ArgumentResolved} from '../arguments/ArgumentParser.js';
import {CommandArgument} from '../arguments/CommandArgument.js';
import type {SubCommand} from '../commands/Command.js';
import {CommandContext, type CommandContextBuilder} from './CommandContext.js';

/**
 * The object to create a new SubCommandContext.
 */
export interface SubCommandContextBuilder extends CommandContextBuilder {
	/**
	 * The SubCommand related to this SubcommandContext.
	 */
	subCommand: SubCommand;
}

/**
 * @see {@link https://ayfri.gitbook.io/advanced-command-handler/concepts/commands/context}
 */
export class SubCommandContext extends CommandContext {
	/**
	 * The SubCommand related to this SubcommandContext.
	 */
	public subCommand: SubCommand;

	/**
	 * Creates a new SubCommandContext associated to a SubCommand.
	 *
	 * @param options - The options of this context.
	 */
	public constructor(options: SubCommandContextBuilder) {
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
	 * Resolves all of the arguments of the SubCommand.
	 * If an argument has an error it will return a {@link CommandError}.
	 *
	 * @typeParam T - The type of the arguments as an union.
	 * @returns - A map of arguments or undefined if the SubCommand has no arguments.
	 */
	public override async resolveArguments<A extends any[]>(): Promise<undefined | Map<string, ArgumentResolved<A[number]>>> {
		if (this.subCommand.arguments) this.argumentParser = new ArgumentParser(this.arguments, this.rawArgs);
		return this.argumentParser?.resolveArguments(this);
	}

	/**
	 * Returns the name of the subCommand associated to this SubCommandContext.
	 */
	get subCommandName() {
		return this.subCommand.name;
	}
}
