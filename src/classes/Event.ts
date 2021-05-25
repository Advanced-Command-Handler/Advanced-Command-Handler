import {ClientEvents} from 'discord.js';
import {RunFunction} from '../types';
import {AdvancedClient} from './AdvancedClient';
import {CommandHandler} from '../CommandHandler';
import {EventContext} from './EventContext.js';

export abstract class Event<Name extends keyof ClientEvents> {
	/**
	 * The name of the event.
	 */
	public abstract readonly name: Name;
	/**
	 * If the event should be fired only once.
	 */
	public once?: boolean = false;

	/**
	 * The run function, executed when the event is fired.
	 */
	public abstract run(ctx: EventContext<Name, this>, ...args: ClientEvents[Name]): void;

	/**
	 * Bind the event to the client, when the `something` event from {@link AdvancedClient} will be fire, this event will be also fired.
	 *
	 * @param client - The client to bind the event from.
	 */
	public bind(client: AdvancedClient): void {
		const context: EventContext<Name, this> = new EventContext({
			event: this,
			handler: CommandHandler,
			values: this.run.arguments
		});

		if (this.once) client?.once(this.name, this.run.bind(null, context));
		else client?.on(this.name, this.run.bind(null, context));
	}

	/**
	 * Unbinds the event to the client.
	 *
	 * @param client - The client to unbind the event from.
	 */
	public unbind(client: AdvancedClient): void {
		client.removeListener(this.name, this.run.bind(null,
			new EventContext({
				event: this,
				handler: CommandHandler,
				values: this.run.arguments
			})
		) as (...args: any[]) => void);
	}
}
