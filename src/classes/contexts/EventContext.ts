import {type CommandHandler} from '../../CommandHandler';
import {Event} from '../Event';

/**
 * Creates a new EventContext.
 */
interface EventContextBuilder<E extends Event> {
	/**
	 * The event related to the EventContext.
	 */
	event: E;
	/**
	 * The CommandHandler.
	 */
	handler: typeof CommandHandler;
}

export class EventContext<E extends Event> implements EventContextBuilder<E> {
	/**
	 * The event related to this EventContext.
	 */
	public event: E;
	/**
	 * The CommandHandler.
	 */
	public handler: typeof CommandHandler;

	/**
	 * Creates a new EventContext associated to an Event.
	 *
	 * @param options - The options of the EventContext.
	 */
	public constructor(options: EventContextBuilder<E>) {
		this.event = options.event;
		this.handler = options.handler;
	}

	/**
	 * Returns the Client.
	 */
	get client() {
		return this.handler.client!!;
	}

	/**
	 * Returns the name of the event associated to this EventContext.
	 */
	get eventName() {
		return this.event.name;
	}
}
