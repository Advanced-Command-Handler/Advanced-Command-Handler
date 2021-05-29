import {GuildMember, Message, User} from 'discord.js';
import {CommandHandler} from '../CommandHandler.js';
import {Command} from './Command.js';

interface CommandContextBuilder {
	args: string[];
	command: Command;
	handler: typeof CommandHandler;
	member: GuildMember | null;
	message: Message;
}

export class CommandContext implements CommandContextBuilder {
	public args: string[];
	public argString: string;
	public command: Command;
	public handler: typeof CommandHandler;
	public member: GuildMember | null;
	public message: Message;
	public user: User;

	public constructor(options: CommandContextBuilder) {
		this.command = options.command;
		this.member = options.member;
		this.message = options.message;
		this.handler = options.handler;
		this.args = options.args;
		this.argString = options.args.join(' ');
		this.user = options.message.author;
	}
}
