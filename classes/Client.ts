import CommandHandler from "./CommandHandler";
import Logger from '../utils/Logger';
import {Client, ClientOptions, Message, PermissionResolvable, Snowflake} from 'discord.js';

/**
 * Class representing an improved Discord Client.
 */
export default class AdvancedClient extends Client {
	handler: CommandHandler;

	constructor(handler: CommandHandler, token: string, options: ClientOptions) {
		super(options);
		this.handler = handler;
		this.token = token;
		Logger.comment('Client initialized.', 'loading');
	}

	hasPermission(message: Message, permission: PermissionResolvable) {
		return message.guild
			? message.guild.me?.hasPermission(permission, {
					checkOwner: false,
					checkAdmin: false,
			  })
			: false;
	}

	isOwner(id: Snowflake) {
		return this.handler.owners.includes(id);
	}
};
