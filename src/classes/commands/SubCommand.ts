// Note: The SubCommand class is in the Command.ts file, check the class documentation to know why.

import {Awaitable} from 'discord.js';
import type {Argument} from '../arguments/Argument.js';
import type {SubCommandContext} from '../contexts/SubCommandContext.js';
import {Tag} from './Command.js';

export type RunSubCommandFunction = (ctx: SubCommandContext) => Awaitable<unknown>;

/**
 * The options for a SubCommand.
 */
export interface SubCommandOptions {
	/**
	 * The aliases of the SubCommand.
	 */
	aliases?: string[];

	arguments?: Record<string, Argument<any>>;
	/**
	 * The channels where the SubCommand can be executed.
	 */
	channels?: string[];
	/**
	 * The description of the SubCommand.
	 *
	 * @remarks If a SubCommand has no description, it will not be shown in the default Help Command.
	 */
	description?: string;
	/**
	 * The tags of the SubCommand.
	 */
	tags?: Array<keyof typeof Tag | Tag>;
	/**
	 * Examples of usages for the SubCommand.
	 */
	usage?: string;
}
