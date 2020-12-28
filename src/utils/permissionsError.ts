import {Message, PermissionString} from 'discord.js';
import {BetterEmbed} from 'discord.js-better-embed';
import {Command} from '../classes/Command.js';

export default (message: Message, missingPermissions: PermissionString[], command: Command, fromClient: boolean = false): Promise<Message> => {
	const embed = BetterEmbed.fromTemplate('title', {
		client: message.client,
		color: 0xee2200,
		title: 'Permissions error :',
		description: `${fromClient ? 'The bot is' : 'You are'} missing permissions :\n\`${missingPermissions.sort().join('`\n`')}\``,
	});

	if (command.usage) embed.addField('Syntax :', command.usage);

	if (message.client.channels.cache.has(message.channel.id)) return message.channel.send(embed);
	else throw new Error(`The channel ${message} is not valid, an ID is expected, if an ID has been entered, then the bot does not have this channel.`);
};
