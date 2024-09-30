import type {APIEmbed} from 'discord-api-types/v10';
import {CommandInteraction, type EmbedBuilder, type InteractionReplyOptions, ModalSubmitInteraction} from 'discord.js';
import type {InteractionHandler} from '../../../InteractionHandler.js';
import {ComponentsBuilder} from '../../components/ComponentsBuilder.js';
import type {ModalComponent} from '../../components/Modal.js';
import type {ApplicationCommand} from '../../interactions/ApplicationCommand.js';
import {RepliableInteractionContext} from './RepliableInteractionContext.js';
import {SubmittedModalContext} from './SubmittedModalContext.js';

export interface ReplyOptions extends Omit<InteractionReplyOptions, 'components'> {
	components?: ComponentsBuilder | InteractionReplyOptions['components'];
	embed?: APIEmbed | EmbedBuilder;
}

/**
 * The options of the ApplicationCommandContext.
 */
export interface ApplicationCommandContextBuilder<T extends ApplicationCommand = ApplicationCommand> {
	/**
	 * The application command that was executed.
	 */
	command: T;
	/**
	 * The interaction that represents the command.
	 */
	interaction: CommandInteraction;
	/**
	 * The handler that handled the command.
	 */
	interactionHandler: typeof InteractionHandler;
}

/**
 * The context of an application command.
 *
 * @property interaction The interaction that represents the command.
 */
	// @ts-expect-error Bug, CommandInteraction is compatible with RepliableInteraction.
export class ApplicationCommandContext<T extends ApplicationCommand = ApplicationCommand> extends RepliableInteractionContext<CommandInteraction> {
	/**
	 * The application command that was executed.
	 */
	public command: T;

	/**
	 * The handler that handled the command.
	 */
	public interactionHandler: typeof InteractionHandler;

	/**
	 * Creates a new SlashCommandContext.
	 *
	 * @param options - The options of the SlashCommandContext.
	 */
	public constructor(options: ApplicationCommandContextBuilder<T>) {
		super(options.interaction);
		this.command = options.command;
		this.interactionHandler = options.interactionHandler;
	}

	/**
	 * The name of the command that was executed.
	 */
	public get commandName() {
		return this.command.name;
	}

	/**
	 * The client that handled the command.
	 */
	public get client() {
		return this.interactionHandler.client!;
	}

	/**
	 * The options of the command that was executed.
	 */
	public get options() {
		return this.interaction.options;
	}

	/**
	 * Run code whenever a modal is submitted.
	 *
	 * @param timeout - The time to wait for the modal to be submitted.
	 * @param callback - The callback to run when the modal is submitted.
	 * @param onFail - The callback to run when the modal submission fails.
	 * @param modal - The modal or modal id to listen for submission on.
	 */
	public onModalSubmit(
		timeout: number,
		callback: (interaction: SubmittedModalContext) => void, onFail?: (error: unknown) => void,
		modal?: ModalComponent | string,
	) {
		const modalId = typeof modal === 'string' ? modal : modal?.customId;
		const filter = modalId ? (interaction: ModalSubmitInteraction) => interaction.customId === modalId : undefined;
		const interaction = this.interaction.awaitModalSubmit({
			time: timeout,
			filter,
		});
		interaction
			.then(interaction => callback(new SubmittedModalContext(interaction)))
			.catch(error => onFail?.(error));
	}

	public showModal(modal: ModalComponent) {
		return this.interaction.showModal(modal.toBuilder());
	}
}
