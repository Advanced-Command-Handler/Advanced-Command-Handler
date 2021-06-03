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
