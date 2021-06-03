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
}
