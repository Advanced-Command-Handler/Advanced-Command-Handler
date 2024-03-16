import type {CommandInteraction} from 'discord.js';
import type {SlashCommand} from '../../interactions/SlashCommand.js';
import {ApplicationCommandContext, type ApplicationCommandContextBuilder} from './ApplicationCommandContext.js';

/**
 * The options of the SlashCommandContext.
 */
export interface SlashCommandContextBuilder extends ApplicationCommandContextBuilder {
	command: SlashCommand;
	interaction: CommandInteraction;
}

/**
 * The context of a slash command.
 */
export class SlashCommandContext extends ApplicationCommandContext {
	override command: SlashCommand;
	override interaction: CommandInteraction;

	/**
	 * Creates a new SlashCommandContext.
	 *
	 * @param options - The options of the SlashCommandContext.
	 */
	public constructor(options: SlashCommandContextBuilder) {
		super(options);
		this.command = options.command;
		this.interaction = options.interaction;
		this.interactionHandler = options.interactionHandler;
	}

	/**
	 * The description of the command that was executed.
	 */
	get commandDescription() {
		return this.command.description;
	}
}
