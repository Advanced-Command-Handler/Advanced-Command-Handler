import {CommandArgument} from '../arguments';
import {CommandContext, CommandContextBuilder} from './CommandContext';

interface ArgumentContextBuilder extends CommandContextBuilder {
	/**
	 * The index of the argument in the arguments of the {@link command}.
	 */
	index: number;
}

export class ArgumentContext extends CommandContext {
	/**
	 * The current argument.
	 */
	public currentArgument: CommandArgument<any>;
	/**
	 * The index of the current argument in the arguments of the {@link command}.
	 */
	public index: number;

	/**
	 * Creates a new ArgumentContext.
	 *
	 * @param options - The options of the ArgumentContext.
	 */
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
