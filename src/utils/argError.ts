import {BetterEmbed} from 'discord.js-better-embed';
import {CommandContext} from '../';

/**
 * A function to use when a user fail on an argument of a command.
 *
 * @param ctx - The message context where the error come from.
 * @param error - The error.
 * @returns - The error message sent.
 */
export function argError(ctx: CommandContext, error: string) {
	const embed = BetterEmbed.fromTemplate('complete', {
		client: ctx.client,
		color: 0xee2200,
		title: 'Argument error :',
		description: error,
	});

	if (ctx.command.usage) embed.addField('Syntax :', ctx.command.usage);
	return ctx.reply({embed});
}
