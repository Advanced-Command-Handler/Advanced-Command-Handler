import type {SlashCommandContext} from '../contexts/interactions/SlashCommandContext.js';

export abstract class SlashCommand {
	public abstract readonly description: string;
	public abstract readonly name: string;

	public abstract run(ctx: SlashCommandContext): Promise<void>;
}
