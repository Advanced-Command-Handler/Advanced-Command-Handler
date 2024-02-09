import {BetterEmbed} from 'discord.js-better-embed';
import {CommandContext, cutIfTooLong, isOwner, Logger} from '../index.js';

/**
 * A function to use when a code error occurs in a command for example.
 *
 * @remarks
 * If the message author is an owner, it sends the error stack. <br>Do not use for sending string as errors.
 * @param ctx - The command context where the error come from.
 * @param error - The native error.
 * @returns - The error message sent.
 */
export function codeError(ctx: CommandContext, error: Error) {
	const embed = BetterEmbed.fromTemplate('complete', {
		client: ctx.client,
		color: 0xee2200,
		title: 'Code error :',
		description: cutIfTooLong(error.stack ?? error.toString(), 2048),
	});

	Logger.error(error, 'CodeError');
	if (isOwner(ctx.user.id)) return ctx.reply({embed});
	return ctx.reply(`An error occurred while executing the \`${ctx.command.name}\` command.`);
}
