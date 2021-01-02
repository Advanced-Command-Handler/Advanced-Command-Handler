interface EventsOptions {
	readonly name: string;
	once?: boolean;
}

export default class Event implements EventsOptions {
	public readonly name: string;
	public once: boolean;

	public constructor(options: EventsOptions) {
		this.name = options.name;
		this.once = options.once ?? false;
	}
}
