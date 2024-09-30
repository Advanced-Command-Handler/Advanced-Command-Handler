import {type Message, PermissionsBitField, type PermissionsString} from 'discord.js';

import {BetterEmbed} from 'discord.js-better-embed';
import type {CommandContext} from '../classes/contexts/CommandContext.js';

/**
 * A function to use when a user, or the client hasn't all the permissions needed.
 *
 * @param ctx - The command context where the permission where missing.
 * @param missingPermissions - The error.
 * @param fromClient - If the error is from the client.
 * @returns - The error message sent.
 */
export function permissionsError(
	ctx: CommandContext,
	missingPermissions: PermissionsString[],
	fromClient: boolean = false,
): Promise<Message> {
	const embed = BetterEmbed.fromTemplate('complete', {
		client: ctx.client,
		color: 0xee2200,
		title: 'Permissions error :',
		description: `${fromClient ? 'The bot is' : 'You are'} missing permissions :\n\`${missingPermissions.sort().join('`\n`')}\``,
	});

	if (ctx.command.usage) {
		embed.addFields({
			name: 'Syntax :',
			value: ctx.command.usage,
		});
	}
	return ctx.reply({embed});
}

/**
 * Check if some permission is a valid permission that exists.
 *
 * @param permission - The permission to test.
 * @returns - Is the permission is a valid permission.
 */
export function isPermission(permission: string): permission is PermissionsString {
	return Object.keys(PermissionsBitField.Flags).includes(permission);
}
