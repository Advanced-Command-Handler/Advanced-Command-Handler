import {CommandContext, CommandContextBuilder} from './CommandContext.js';
import {SubCommand} from '../commands/Command.js';

export interface SubCommandContextBuilder extends CommandContextBuilder {
	subCommand: SubCommand;
}

export class SubCommandContext extends CommandContext {
	public subCommand: SubCommand;

	public constructor(options: SubCommandContextBuilder) {
		super(options);
		this.subCommand = options.subCommand;
	}
}
