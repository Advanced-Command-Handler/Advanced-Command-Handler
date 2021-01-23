import {Message, PermissionString} from 'discord.js';
import {BetterEmbed} from 'discord.js-better-embed';
import {Command} from '../classes/Command';

/**
 * @param message
 * @param missingPermissions
 * @param command
 * @param fromClient
 */
export function permissionsError(message: Message, missingPermissions: PermissionString[], command: Command, fromClient: boolean = false): Promise<Message> {
	const embed = BetterEmbed.fromTemplate('complete', {
		client: message.client,
		color: 0xee2200,
		title: 'Permissions error :',
		description: `${fromClient ? 'The bot is' : 'You are'} missing permissions :\n\`${missingPermissions.sort().join('`\n`')}\``,
	});

	if (command.usage) embed.addField('Syntax :', command.usage);
	return message.channel.send(embed);
};
