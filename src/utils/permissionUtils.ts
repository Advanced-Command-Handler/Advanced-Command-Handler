import {Message, PermissionString, Permissions} from 'discord.js';
import {BetterEmbed} from 'discord.js-better-embed';
import {Command} from '../classes';

/**
 * A function to use when a user, or the client hasn't all the permissions needed.
 *
 * @param message - The message where the error is from.
 * @param missingPermissions - The error.
 * @param command - The command to be executed.
 * @param fromClient - If the error is from the client.
 * @returns - The error message sent.
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
}

/**
 * Check if some permission is a valid permission that exists.
 *
 * @param permission - The permission to debug.
 * @returns - Is the permission is a valid permission.
 */
export function isPermission(permission: string): permission is PermissionString {
	return Object.keys(Permissions.FLAGS).includes(permission);
}
