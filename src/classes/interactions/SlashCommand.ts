import {SlashCommandBuilder} from '@discordjs/builders';
import type {RESTPostAPIApplicationCommandsJSONBody} from 'discord-api-types/v9';
import type {SlashCommandContext} from '../contexts/interactions/SlashCommandContext.js';

export abstract class SlashCommand {
	public abstract readonly description: string;
	public abstract readonly name: string;

	public abstract run(ctx: SlashCommandContext): Promise<void>;

	public toJSON(): RESTPostAPIApplicationCommandsJSONBody {
		return new SlashCommandBuilder().setName(this.name).setDescription(this.description).toJSON();
	}
}
