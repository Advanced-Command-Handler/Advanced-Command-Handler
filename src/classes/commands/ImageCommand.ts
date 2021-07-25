import {DMChannel, TextChannel} from 'discord.js';
import {BetterEmbed} from 'discord.js-better-embed';
import {Command} from './Command';

/**
 * The options for setting an image in an embed.
 */
export interface ImageEmbedOptions {
	/**
	 * Link of the image.
	 */
	link?: string;

	/**
	 * Local path of the image.
	 */
	path?: string;

	/**
	 * Channel where to send the image.
	 */
	channel: TextChannel | DMChannel;

	/**
	 * Title of the embed.
	 */
	title: string;

	/**
	 * Description of the embed.
	 */
	description: string;
}

/**
 *The options for setting a local image in a message.
 */
export interface ImageLocal {
	/**
	 * Local path of the image.
	 */
	path: string;

	/**
	 * Channel where to send the image.
	 */
	channel: TextChannel | DMChannel;

	/**
	 * Content of the message.
	 */
	content: string;
}

/**
 * @see {@link https://ayfri.gitbook.io/advanced-command-handler/concepts/commands/templates}
 */
export abstract class ImageCommand extends Command {
	/**
	 * Send a local image from your files.
	 *
	 * @param options - The options.
	 */
	public async sendLocalImage(options: ImageLocal) {
		await options.channel.send(options.content, {files: [options.path]});
	}

	/**
	 * Send a local image in an embed from your files.
	 *
	 * @param options - The options.
	 */
	public async sendImageEmbed(options: ImageEmbedOptions) {
		const link = options.link ?? options.path ?? '';
		const embed = BetterEmbed.fromTemplate('image', {
			...options,
			image: link,
		});

		if (options.path) embed.setImageFromFile(link);
		await options.channel.send(embed);
	}
}
