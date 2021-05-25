import {ClientEvents} from 'discord.js';
import {CommandHandler} from '../CommandHandler.js';
import {Event} from './Event.js';

interface EventContextBuilder<E extends Event> {
	event: E;
	handler: typeof CommandHandler;
}

export class EventContext<E extends Event> implements EventContextBuilder<E>{
	public event: E;
	public handler: typeof CommandHandler;

	public constructor(options: EventContextBuilder<E>) {
		this.event = options.event;
		this.handler = options.handler;
	}
}
