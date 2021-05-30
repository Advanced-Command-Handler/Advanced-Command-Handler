import {Client, ClientOptions, Message, PermissionResolvable} from 'discord.js';
import {Logger} from '../utils/Logger';

export class AdvancedClient extends Client {
	/**
	 * @param token - The token for the client.
	 * @param options - The client options.
	 * @see {@link https://discord.js.org/#/docs/main/stable/typedef/ClientOptions}
	 */
	public constructor(token: string, options: ClientOptions) {
		super(options);
		this.token = token;
		Logger.comment('Client initialized.', 'loading');
	}

	get id() {
		return this.user?.id;
	}

	get mention(): `<@${string | undefined}>` {
		return `<@${this.id}>`;
	}

	get ping() {
		return this.ws.ping;
	}

	get tag() {
		return this.user?.tag;
	}

	get username() {
		return this.user?.username;
	}

	/**
	 * Tells you if the client has permissions from a message in a fancy way than the {@link https://discord.js.org/#/docs/main/stable/class/GuildMember?scrollTo=hasPermission | GuildMember#hasPermission} method.
	 *
	 * @param message - The message to check permissions from.
	 * @param permission - The permission to check.
	 * @returns If the user has the permission.
	 */
	public hasPermission(message: Message, permission: PermissionResolvable) {
		return message.guild
			? message.guild.me?.hasPermission(permission, {
					checkOwner: false,
					checkAdmin: false,
			  })
			: false;
	}
}
