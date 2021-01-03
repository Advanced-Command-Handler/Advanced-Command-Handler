import {RunFunction} from '../types';

interface EventsOptions {
	readonly name: string;
	once?: boolean;
}

export default class Event implements EventsOptions {
	public readonly name: string;
	public once: boolean;
	public run: RunFunction;

	public constructor(options: EventsOptions, runFunction: RunFunction) {
		this.run = runFunction;
		this.name = options.name;
		this.once = options.once ?? false;
	}
}
