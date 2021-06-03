import {SubCommand} from '../commands';
import {CommandContext, CommandContextBuilder} from './CommandContext';

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
