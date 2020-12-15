import {CommandHandlerInstance} from './CommandHandler.js';
import {Logger} from '../utils/Logger.js';
import {Client, ClientOptions, Message, PermissionResolvable, Snowflake} from 'discord.js';

export default class AdvancedClient extends Client {
	public readonly handler: CommandHandlerInstance;
	
	public constructor(handler: CommandHandlerInstance, token: string, options: ClientOptions) {
		super(options);
		this.handler = handler;
		this.token = token;
		Logger.comment('Client initialized.', 'loading');
	}
	
	public hasPermission(message: Message, permission: PermissionResolvable) {
		return message.guild
			? message.guild.me?.hasPermission(permission, {
					checkOwner: false,
					checkAdmin: false,
			  })
			: false;
	}
	
	public isOwner(id: Snowflake) {
		return this.handler.owners?.includes(id);
	}
}
