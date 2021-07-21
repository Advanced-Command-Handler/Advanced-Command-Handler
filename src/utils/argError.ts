import {Message} from 'discord.js';
import {BetterEmbed} from 'discord.js-better-embed';
import {Command} from '../classes';

/**
 * A function to use when a user fail on an argument of a command.
 *
 * @param message - The message where the error is from.
 * @param error - The error.
 * @param command - The command to be executed.
 * @returns - The error message sent.
 */
export function argError(message: Message, error: string, command: Command) {
	const embed = BetterEmbed.fromTemplate('complete', {
		client: message.client,
		color: 0xee2200,
		title: 'Argument error :',
		description: error,
	});

	if (command.usage) embed.addField('Syntax :', command.usage);
	return message.channel.send(embed);
}
