import {Message} from 'discord.js';
import {BetterEmbed} from 'discord.js-better-embed';
import {Command} from '../classes/Command';

/**
 * @param message
 * @param error
 * @param command
 */
export function argError(message: Message, error: string, command: Command): Promise<Message>  {
	const embed = BetterEmbed.fromTemplate('complete', {
		client: message.client,
		color: 0xee2200,
		title: 'Argument error :',
		description: error,
	});

	if (command.usage) embed.addField('Syntax :', command.usage);
	return message.channel.send(embed);
};
