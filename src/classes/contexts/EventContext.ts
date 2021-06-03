import {CommandHandler} from '../../CommandHandler';
import {Event} from '../Event';

interface EventContextBuilder<E extends Event> {
	event: E;
	handler: typeof CommandHandler;
}

export class EventContext<E extends Event> implements EventContextBuilder<E> {
	public event: E;
	public handler: typeof CommandHandler;

	public constructor(options: EventContextBuilder<E>) {
		this.event = options.event;
		this.handler = options.handler;
	}

	get client() {
		return this.handler.client!!;
	}

	get eventName() {
		return this.event.name;
	}
}
