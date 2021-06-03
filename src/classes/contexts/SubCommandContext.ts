import {SubCommand} from '../commands/Command.js';
import {CommandContext, CommandContextBuilder} from './CommandContext.js';

export interface SubCommandContextBuilder extends CommandContextBuilder {
	subCommand: SubCommand;
}

export class SubCommandContext extends CommandContext {
	public subCommand: SubCommand;

	public constructor(options: SubCommandContextBuilder) {
		super(options);
		this.subCommand = options.subCommand;
	}

	get subCommandName() {
		return this.subCommand.name;
	}
}
