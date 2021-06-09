import {Client, ClientOptions} from 'discord.js';
import {Logger} from '../utils';

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

	/**
	 * Get the ID of the ClientUser.
	 *
	 * @returns - Returns the ID the ClientUser.
	 */
	get id() {
		return this.user?.id;
	}

	/**
	 * Get the mention of the ClientUser.
	 */
	get mention(): `<@${string | undefined}>` {
		return `<@${this.id}>`;
	}

	/**
	 * Returns the ping of the websocket.
	 */
	get ping() {
		return this.ws.ping;
	}

	/**
	 * Returns the tag of the ClientUser.
	 */
	get tag() {
		return this.user?.tag;
	}

	/**
	 * Returns the username of the ClientUser.
	 */
	get username() {
		return this.user?.username;
	}
}
