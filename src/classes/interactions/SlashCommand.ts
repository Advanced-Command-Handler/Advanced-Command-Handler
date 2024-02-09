import {SlashCommandContext} from '../contexts/index.js';


export abstract class SlashCommand {
	public abstract readonly name: string;
	public abstract readonly description: string;

	public abstract run(ctx: SlashCommandContext): Promise<void>;
}
