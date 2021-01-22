import {Message} from 'discord.js';
import {BetterEmbed} from 'discord.js-better-embed';
import {Command} from '../classes/Command';
import {Logger} from './Logger';
import {cutIfTooLong, isOwner} from './utils';

export default (message: Message, error: Error, command: Command): Promise<Message> => {
	const embed = BetterEmbed.fromTemplate('complete', {
		client: message.client,
		color: 0xee2200,
		title: 'Code error :',
		description: cutIfTooLong(error.stack ?? error.toString(), 2048),
	});

	Logger.error(error, 'CodeError');
	return isOwner(message.author.id) ? message.channel.send(embed) : message.channel.send(`An error occurred while executing the \`${command.name}\` command.`);
};
