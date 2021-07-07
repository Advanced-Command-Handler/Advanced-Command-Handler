/* eslint-disable jsdoc/require-jsdoc */
import {Command, CommandContext} from '../../classes';

export class PingCommand extends Command {
	override name = 'ping';
	override category = 'utils';
	override description = 'Get the ping of the bot.';
	override tags = ['guildOnly'];
	override userPermissions = ['MANAGE_messageS'];

	public override async run(ctx: CommandContext) {
		const msg = await ctx.reply('Ping ?');
		const botPing = ctx.client.ping;
		const apiPing = msg.createdTimestamp - ctx.message.createdTimestamp;
		await msg.edit(`WS Ping: **${botPing}**ms\nAPI Latency: **${apiPing}**ms`);
	}
}
