import {Command, CommandContext} from '../../classes/index.js';

export class PingCommand extends Command {
	override category = 'utils';
	override description = 'Get the ping of the bot.';
	override name = 'ping';
	override tags = ['guildOnly'];
	override userPermissions = ['MANAGE_MESSAGES'];

	public override async run(ctx: CommandContext) {
		const msg = await ctx.reply('Ping ?');
		const botPing = ctx.client.ping;
		const apiPing = msg.createdTimestamp - ctx.message.createdTimestamp;
		await msg.edit(`WS Ping: **${botPing}**ms\nAPI Latency: **${apiPing}**ms`);
	}
}
