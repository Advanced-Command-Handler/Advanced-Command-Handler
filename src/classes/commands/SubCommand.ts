// Note : The SubCommand class is in the Command.ts file, see the class to know why.

import {SubCommandContext} from '../contexts';
import {Tag} from './Command';

export type RunSubCommandFunction = (ctx: SubCommandContext) => Promise<any>;

export interface SubCommandOptions {
	aliases?: string[];
	channels?: string[];
	description?: string;
	tags?: Array<keyof typeof Tag | Tag>;
	usage?: string;
}
