// Note: The SubCommand class is in the SlashCommand.ts file, check the class documentation to know why.

import type {SlashCommandArguments} from '../arguments/CommandArgument.js';
import type {SlashCommandArgument} from '../arguments/SlashCommandArgument.js';
import type {SubSlashCommandContext} from '../contexts/interactions/SubSlashCommandContext.js';
import type {SubSlashCommand} from './SlashCommand.js';

export type RunSubSlashCommandFunction<T extends SubSlashCommand<A>, A extends SlashCommandArguments = T['arguments']> = (
	ctx: SubSlashCommandContext<T>
) => Promise<unknown>;

export interface SubSlashCommandOptions<T extends Record<string, SlashCommandArgument<any>>> {
	arguments?: T;
	description: string;
}
