import {Message} from 'discord.js';
import {BetterEmbed} from 'discord.js-better-embed';
import {Command} from '../classes/Command';
import {Logger} from './Logger';
import {cutIfTooLong, isOwner} from './utils';

/**
 * A function to use when a code error occurs in a command for example.
 *
 * @remarks
 * If the message author is an owner, it sends the error stack.
 *
 * @param message - The message where the error is from.
 * @param error - The error.
 * @param command - The command to be executed.
 *
 * @returns The error message sent.
 */
export function codeError(message: Message, error: Error, command: Command): Promise<Message> {
	const embed = BetterEmbed.fromTemplate('complete', {
		client: message.client,
		color: 0xee2200,
		title: 'Code error :',
		description: cutIfTooLong(error.stack ?? error.toString(), 2048),
	});

	Logger.error(error, 'CodeError');
	return isOwner(message.author.id) ? message.channel.send(embed) : message.channel.send(`An error occurred while executing the \`${command.name}\` command.`);
}
