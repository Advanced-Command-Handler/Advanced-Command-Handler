import {DMChannel, Message, MessageAttachment, TextChannel} from 'discord.js';
import {BetterEmbed} from 'discord.js-better-embed';
import {Command} from './Command.js';

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

export abstract class ImageCommand extends Command {
	public async sendLocalImage(options: ImageLocal) {
		await options.channel.send(options.content, {files: [options.path]});
	}

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
