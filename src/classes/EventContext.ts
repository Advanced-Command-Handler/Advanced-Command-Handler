import {ClientEvents} from 'discord.js';
import {CommandHandler} from '../CommandHandler.js';
import {Event} from './Event.js';

interface EventContextBuilder<T extends keyof ClientEvents, E extends Event<T>> {
	event: E;
	handler: typeof CommandHandler;
	values: T;
}

export class EventContext<T extends keyof ClientEvents, E extends Event<T>> implements EventContextBuilder<T, E>{
	public event: E;
	public handler: typeof CommandHandler;
	public values: T;

	public constructor(options: EventContextBuilder<T, E>) {
		this.event = options.event;
		this.handler = options.handler;
		this.values = options.values;
	}
}
