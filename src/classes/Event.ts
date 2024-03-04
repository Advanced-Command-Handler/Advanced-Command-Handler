import type {Awaitable, ClientEvents} from 'discord.js';
import {CommandHandler} from '../CommandHandler.js';
import {InteractionHandler} from '../InteractionHandler.js';
import {AdvancedClient} from './AdvancedClient.js';
import {EventContext} from './contexts/EventContext.js';

type EventArguments<T extends {name: keyof ClientEvents}> = ClientEvents[T['name']];

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
	 * Bind the event to the client, when the `something` event from {@link AdvancedClient} will be fire, this event will be also fired.
	 *
	 * @param client - The client to bind the event from.
	 */
	public bind(client: AdvancedClient) {
		const context = new EventContext<this>({
			event: this,
			handler: CommandHandler,
			interactionHandler: InteractionHandler,
		});

		if (this.once) client.once(this.name, (...args: EventArguments<this>) => this.run(context, ...args));
		else client.on(this.name, (...args: EventArguments<this>) => this.run(context, ...args));
	}

	/**
	 * The run function, executed when the event is fired.
	 */
	public abstract run(ctx: EventContext<this>, ...args: EventArguments<this>): Awaitable<any>;

	/**
	 * Unbinds the event to the client.
	 *
	 * @param client - The client to unbind the event from.
	 */
	public unbind(client: AdvancedClient) {
		const context = new EventContext({
			event: this,
			handler: CommandHandler,
			interactionHandler: InteractionHandler,
		});
		client.removeListener(this.name, (...args) => this.run(context, ...(args as EventArguments<this>)));
	}
}
