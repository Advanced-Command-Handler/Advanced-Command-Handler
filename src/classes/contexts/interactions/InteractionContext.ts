import type {APIInteractionGuildMember} from 'discord-api-types/v9';
import {ButtonInteraction, type CacheType, type CacheTypeReducer, type GuildMember, type Interaction} from 'discord.js';
import {CommandHandlerError} from '../../errors/CommandHandlerError.js';


/**
 * The options of the button click.
 */
export interface OnClickOptions {
	/**
	 * The id of the button to listen for, can be undefined to listen for all buttons.
	 */
	buttonId?: string;
	/**
	 * The amount of times to listen for the button click, can be Infinity to listen indefinitely, defaults to 1.
	 */
	count?: number;
	/**
	 * The time to wait for the button click, defaults to 60 seconds.
	 * Cannot be infinite, consider using event listeners for indefinite timeouts.
	 */
	timeout: number;
}


/**
 * The context of an interaction.
 */
export class InteractionContext<T extends Interaction> {
	/**
	 * @param interaction - The interaction that was executed.
	 */
	public constructor(public interaction: T) {
	}

	/**
	 * The channel where the command was executed.
	 */
	get channel() {
		return this.interaction.channel;
	}

	/**
	 * The guild where the command was executed.
	 */
	get guild() {
		return this.interaction.guild;
	}

	/**
	 * The id of the interaction that was executed.
	 */
	get id() {
		return this.interaction.id;
	}

	/**
	 * The member who executed the command.
	 */
	get member(): CacheTypeReducer<CacheType, GuildMember, APIInteractionGuildMember> {
		// @ts-expect-error Version mismatch.
		return this.interaction.member;
	}

	/**
	 * The token of the command that was executed.
	 */
	get token() {
		return this.interaction.token;
	}

	/**
	 * The user who executed the command.
	 */
	get user() {
		return this.interaction.user;
	}


	/**
	 * Run code whenever a button is clicked.

	 * @param options - The options of the button click.
	 * @param callback - The callback to run when the button is clicked.
	 * @param onFail - The callback to run when the button click fails.
	 */
	public onButtonClick(
		options: OnClickOptions = {timeout: 60_000},
		callback: (interaction: ButtonInteraction) => void,
		onFail?: (error: unknown) => void,
	) {
		const count = options.count ?? 1;
		if (count < 1) {
			throw new CommandHandlerError('Count must be greater than 0 or Infinity to listen indefinitely.', 'OnButtonClick');
		}

		const filter = options.buttonId ? (interaction: ButtonInteraction) => interaction.customId === options.buttonId : undefined;
		const collector = this.channel!.createMessageComponentCollector({
			componentType: 'BUTTON',
			filter,
		});

		collector.on('collect', interaction => {
			callback(interaction);
			if (collector.collected.size <= count) {
				collector.stop();
			}
		});

		collector.on('end', () => {
			if (count > 0 && collector.collected.size < count) {
				onFail?.(new CommandHandlerError('Button click timed out and button click count was not infinite.', 'OnButtonClick'));
			}
		});
	}
}
