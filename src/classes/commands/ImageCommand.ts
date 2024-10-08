import {AttachmentBuilder, type GuildTextBasedChannel} from 'discord.js';
import {BetterEmbed} from 'discord.js-better-embed';
import type {CommandContext} from '../contexts/CommandContext.js';
import {CommandHandlerError} from '../errors/CommandHandlerError.js';
import {Command} from './Command.js';

/**
 * The options for setting an image in an embed.
 */
export interface ImageEmbedOptions {
	/**
	 * Channel where to send the image.
	 */
	channel: GuildTextBasedChannel;
	/**
	 * Description of the embed.
	 */
	description: string;
	/**
	 * Link of the image.
	 */
	link?: string;
	/**
	 * Local path of the image.
	 */
	path?: string;
	/**
	 * Title of the embed.
	 */
	title: string;
}

/**
 * The options for setting an image in an embed to send in a context.
 */
export interface ImageEmbedContextOptions extends Omit<ImageEmbedOptions, 'channel'> {
	/**
	 * The context where to send the image.
	 */
	ctx: CommandContext;
}

/**
 *The options for setting a local image in a message.
 */
export interface ImageLocalOptions {
	/**
	 * Channel where to send the image.
	 */
	channel: GuildTextBasedChannel;

	/**
	 * Content of the message.
	 */
	content: string;

	/**
	 * Local path of the image.
	 */
	path: string;
}

/**
 *The options for setting a local image in a message from a context.
 */
export interface ImageLocalContextOptions extends Omit<ImageLocalOptions, 'channel'> {
	/**
	 * The context where to send the image.
	 */
	ctx: CommandContext;
}

/**
 * @see {@link https://ayfri.gitbook.io/advanced-command-handler/concepts/commands/templates}
 */
export abstract class ImageCommand extends Command {
	/**
	 * Send a local image in an embed from your files.
	 *
	 * @param options - The options.
	 * @returns - The message with the embed sent.
	 */
	public async sendImageEmbed(options: ImageEmbedOptions | ImageEmbedContextOptions) {
		const channel = 'ctx' in options ? options.ctx.textChannel : options.channel;
		if (!channel) throw new CommandHandlerError('No channel provided.', 'ImageCommand');

		const link = options.link ?? options.path ?? '';
		const embed = BetterEmbed.fromTemplate('image', {
			...options,
			image: link,
		});

		const attachment = new AttachmentBuilder(link);
		if (options.path) embed.setImageFromFile(attachment);
		return await channel.send({embeds: [embed]});
	}

	/**
	 * Send a local image from your files.
	 *
	 * @param options - The options.
	 * @returns - The message with the image sent.
	 */
	public async sendLocalImage(options: ImageLocalOptions | ImageLocalContextOptions) {
		const channel = 'ctx' in options ? options.ctx.textChannel : options.channel;
		if (!channel) throw new CommandHandlerError('No channel provided.', 'ImageCommand');
		return await channel.send({
			content: options.content,
			files: [options.path],
		});
	}
}
