import {ArgumentParser, ArgumentResolved, CommandArgument} from '../arguments';
import {SubCommand} from '../commands';
import {CommandContext, CommandContextBuilder} from './CommandContext';

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

	override get arguments() {
		return Object.entries(this.subCommand.arguments).map((a, index) => new CommandArgument(a[0], index, a[1]));
	}

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
