import {RunFunction} from '../types';
import AdvancedClient from './AdvancedClient';
import CommandHandler from '../CommandHandler';

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

	public bind(client: AdvancedClient): void {
		if (this.once) client?.once(this.name, this.run.bind(null, CommandHandler));
		else client?.on(this.name, this.run.bind(null, CommandHandler));
	}

	public unbind(client: AdvancedClient): void {
		client.removeListener(this.name, this.run.bind(null, CommandHandler));
	}
}
