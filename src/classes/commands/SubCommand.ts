import {Command, Tag} from './Command.js';
import {SubCommandContext} from './SubCommandContext.js';

export type RunSubCommandFunction = (ctx: SubCommandContext) => Promise<any>;

export interface SubCommandOptions {
	aliases?: string[];
	channels?: string[];
	description?: string;
	tags?: Array<keyof typeof Tag | Tag>;
	usage?: string;
}

export abstract class SubCommand extends Command {
	public readonly name: string;
	public readonly runFunction: RunSubCommandFunction;

	public constructor(name: string, options: SubCommandOptions = {}, runFunction: RunSubCommandFunction) {
		super();
		this.name = name;
		this.aliases = options.aliases;
		this.channels = options.channels;
		this.description = options.description;
		this.tags = options.tags;
		this.usage = options.usage;
		this.runFunction = runFunction;
	}

	public async run(ctx: SubCommandContext): Promise<any> {
		return await this.runFunction(ctx);
	}
}
