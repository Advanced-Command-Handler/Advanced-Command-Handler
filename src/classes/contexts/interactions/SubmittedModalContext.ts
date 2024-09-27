import {type CacheType, type GuildCacheMessage, ModalSubmitInteraction, type PartialTextInputData} from 'discord.js';
import {RepliableInteractionContext} from './RepliableInteractionContext.js';

export class SubmittedModalContext extends RepliableInteractionContext<ModalSubmitInteraction> {
	public constructor(interaction: ModalSubmitInteraction) {
		super(interaction);
	}

	/**
	 * The entries of the fields that were submitted.
	 */
	public get entries() {
		return new Map(this.rawFields.map(value => [value.customId, value.value]));
	}

	/**
	 * The fields that were submitted, as a {@link import("discord.js").ModalSubmitFieldsResolver} from discord.js.
	 */
	public get fields() {
		return this.interaction.fields;
	}

	/**
	 * The message that displayed the modal.
	 */
	public get message(): GuildCacheMessage<CacheType> | null {
		return this.interaction.message;
	}

	/**
	 * The raw fields that were submitted.
	 */
	public get rawFields(): PartialTextInputData[] {
		// @ts-expect-error This is on purpose to add access to raw data to user.
		return this.interaction.fields._fields;
	}

	/**
	 * The values of the fields that were submitted.
	 */
	public get values() {
		return this.rawFields.map(value => value.value);
	}
}
