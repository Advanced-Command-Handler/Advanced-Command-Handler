import {CommandArgument} from '../arguments';
import {CommandContext, CommandContextBuilder} from './CommandContext';

interface ArgumentContextBuilder extends CommandContextBuilder {
	index: number;
}

export class ArgumentContext extends CommandContext {
	public currentArgument: CommandArgument<any>;
	public index: number;

	public constructor(options: ArgumentContextBuilder) {
		options.message.content = options.rawArgs.slice(options.index, options.index + 1)[0];
		options.message.mentions.channels.clear();
		options.message.mentions.members?.clear();
		options.message.mentions.users.clear();
		super(options);
		this.index = options.index;
		this.currentArgument = this.arguments[options.index];
	}
}
