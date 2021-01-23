import {Logger} from '../utils/Logger';
import {Client, ClientOptions, Message, PermissionResolvable} from 'discord.js';

export class AdvancedClient extends Client {
	public constructor(token: string, options: ClientOptions) {
		super(options);
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
}
