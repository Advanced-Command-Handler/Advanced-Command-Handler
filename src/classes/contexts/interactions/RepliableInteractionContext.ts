import {Interaction, type InteractionReplyOptions, InteractionResponse, MessagePayload, type RepliableInteraction} from 'discord.js';
import {ComponentsBuilder} from '../../components/ComponentsBuilder.js';
import type {ReplyOptions} from './ApplicationCommandContext.js';
import {InteractionContext} from './InteractionContext.js';

/**
 * The context of an interaction that can be replied to.
 */
export class RepliableInteractionContext<T extends Interaction & RepliableInteraction> extends InteractionContext<T> {
	/**
	 * Defer the reply of the command.
	 */
	public async defer() {
		await this.interaction.deferReply();
	}

	/**
	 * Reply with options.
	 */
	public reply<T extends ReplyOptions>(options: T): Promise<InteractionResponse<T['fetchReply'] extends true ? true : false>>;
	/**
	 * Reply with raw content.
	 */
	public reply(content: string | MessagePayload): Promise<InteractionResponse<boolean>>;
	/**
	 * Reply with content and options.
	 */
	public reply<T extends ReplyOptions>(content: string, options: T): Promise<InteractionResponse<T['fetchReply'] extends true
	                                                                                               ? true
	                                                                                               : false>>;

	/**
	 * Reply to the command.
	 *
	 * @param content - The options of the reply.
	 * @param options - The options of the reply message.
	 *
	 * @returns The message that was replied if `fetchReply` is set to `true`.
	 */
	public async reply(content: string | ReplyOptions | MessagePayload, options?: ReplyOptions) {
		if (content instanceof MessagePayload) {
			return this.interaction.reply(content);
		}

		const finalOptions: ReplyOptions = typeof content === 'string' ? {content} : content;
		if (options) {
			if (options.embed && !options.embeds) options.embeds = [options.embed];
			options.fetchReply = true;
			Object.assign(finalOptions, options);
		}

		const components = finalOptions.components;
		if (components instanceof ComponentsBuilder) {
			finalOptions.components = components.toJSON() as any;
		}

		return this.interaction.reply(finalOptions as InteractionReplyOptions);
	}
}
