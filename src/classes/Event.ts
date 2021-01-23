import {RunFunction} from '../types';
import {AdvancedClient} from './AdvancedClient';
import {CommandHandler} from '../CommandHandler';

export interface EventsOptions {
	/**
	 * The name of the event.
	 */
	readonly name: string;
	/**
	 * If the event should be fired only once.
	 */
	once?: boolean;
}

export class Event implements EventsOptions {
	/**
	 * The name of the event.
	 */
	public readonly name: string;
	/**
	 * If the event should be fired only once.
	 */
	public once: boolean;
	/**
	 * The run function, executed when the event is fired.
	 */
	public run: RunFunction;

	/**
	 *
	 * @param options - Options for the event.
	 * @param runFunction - The run function, executed when the event is fired.
	 * {@link "@discord.js".GuildMember}
	 */
	public constructor(options: EventsOptions, runFunction: RunFunction) {
		this.run = runFunction;
		this.name = options.name;
		this.once = options.once ?? false;
	}

	/**
	 * Bind the event to the client, when the `something` event from {@link AdvancedClient} will be fire, this event will be also fired.
	 *
	 * @param client - The client to bind the event from.
	 */
	public bind(client: AdvancedClient): void {
		if (this.once) client?.once(this.name, this.run.bind(null, CommandHandler));
		else client?.on(this.name, this.run.bind(null, CommandHandler));
	}

	/**
	 * Unbinds the event to the client.
	 *
	 * @param client - The client to unbind the event from.
	 */
	public unbind(client: AdvancedClient): void {
		client.removeListener(this.name, this.run.bind(null, CommandHandler));
	}
}
