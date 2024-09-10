import {Command, Tag} from '../../classes/commands/Command.js';
import type {CommandContext} from '../../classes/contexts/CommandContext.js';
import {Permissions} from '../../constants.js';

export class PingCommand extends Command {
	override category = 'utils';
	override description = 'Get the ping of the bot.';
	override name = 'ping';
	override tags = [Tag.guildOnly];
	override userPermissions = [Permissions.MANAGE_MESSAGES];

	public override async run(ctx: CommandContext) {
		const msg = await ctx.reply('Ping ?');
		const botPing = ctx.client.ping;
		const apiPing = msg.createdTimestamp - ctx.message.createdTimestamp;
		await msg.edit(`WS Ping: **${botPing}**ms\nAPI Latency: **${apiPing}**ms`);
	}
}
