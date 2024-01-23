import type {Awaitable, ClientEvents} from 'discord.js';
import {CommandHandler} from '../CommandHandler';
import {AdvancedClient} from './AdvancedClient';
import {EventContext} from './contexts';

/**
 * @see {@link https://ayfri.gitbook.io/advanced-command-handler/concepts/events}
 */
export abstract class Event {
	/**
	 * The name of the event.
	 */
	public abstract readonly name: keyof ClientEvents;
	/**
	 * If the event should be fired only once.
	 */
	public once: boolean = false;

	/**
	 * The run function, executed when the event is fired.
	 */
	public abstract run(ctx: EventContext<this>, ...args: ClientEvents[this['name']]): Awaitable<any>;

	/**
	 * Bind the event to the client, when the `something` event from {@link AdvancedClient} will be fire, this event will be also fired.
	 *
	 * @param client - The client to bind the event from.
	 */
	public bind(client: AdvancedClient) {
		const context = new EventContext<this>({
			event: this,
			handler: CommandHandler,
		});

		if (this.once) client.once(this.name, (...args: ClientEvents[this['name']]) => this.run(context, ...args));
		else client.on(this.name, (...args: ClientEvents[this['name']]) => this.run(context, ...args));
	}

	/**
	 * Unbinds the event to the client.
	 *
	 * @param client - The client to unbind the event from.
	 */
	public unbind(client: AdvancedClient) {
		const context = new EventContext({
			event: this,
			handler: CommandHandler,
		});
		client.removeListener(
			this.name,
			(...args) => this.run(context, ...args as ClientEvents[this['name']])
		);
	}
}
