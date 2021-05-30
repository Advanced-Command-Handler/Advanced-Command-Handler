import {Message, PermissionResolvable, Permissions, PermissionString} from 'discord.js';
import {BetterEmbed} from 'discord.js-better-embed';
import {Command} from '../classes/Command';

/**
 * A function to use when an user or the client hasn't all the permissions needed.
 *
 * @param message - The message where the error is from.
 * @param missingPermissions - The error.
 * @param command - The command to be executed.
 * @param fromClient - If the error is from the client.
 * @returns The error message sent.
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

/**
 * Tells you if the client has permissions from a message in a fancy way than the {@link https://discord.js.org/#/docs/main/stable/class/GuildMember?scrollTo=hasPermission | GuildMember#hasPermission} method.
 *
 * @param message - The message to check permissions from.
 * @param permission - The permission to check.
 * @returns If the user has the permission.
 */
function hasPermission(message: Message, permission: PermissionResolvable) {
	return message.guild
		? message.guild.me?.hasPermission(permission, {
				checkOwner: false,
				checkAdmin: false,
		  })
		: false;
}
