import {Command} from '../../classes/commands/Command.js';
import {CommandContext} from '../../classes/commands/CommandContext.js';

export class PingCommand extends Command {
	name = 'ping';
	category = 'utils';
	description = 'Get the ping of the bot.';
	tags = ['guildOnly'];
	userPermissions = ['MANAGE_MESSAGES'];

	public override async run(ctx: CommandContext) {
		const msg = await ctx.reply('Ping ?');
		const botPing = ctx.client.ping;
		const apiPing = msg.createdTimestamp - ctx.message.createdTimestamp;
		await msg.edit(`Bot Latency: **${botPing}**ms\nAPI Latency: **${apiPing}**ms`);
	}
}
