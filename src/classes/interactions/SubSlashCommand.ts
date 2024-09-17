// Note: The SubCommand class is in the SlashCommand.ts file, check the class documentation to know why.

import type {SlashCommandArgument} from '../arguments/SlashCommandArgument.js';
import type {SubSlashCommandContext} from '../contexts/interactions/SubSlashCommandContext.js';

export type RunSubSlashCommandFunction = (ctx: SubSlashCommandContext) => Promise<void>;

export interface SubSlashCommandOptions {
	arguments?: Record<string, SlashCommandArgument<any>>;
	description: string;
}
