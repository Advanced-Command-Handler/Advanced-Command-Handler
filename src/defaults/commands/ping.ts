import {Command} from '../../classes/Command';
import {CommandContext} from '../../classes/CommandContext.js';

export class PingCommand extends Command {
	constructor() {
		super({
			name: 'ping',
			tags: ['guildOnly'],
			userPermissions: ['MANAGE_MESSAGES'],
			category: 'utils'
		});
	}

	public async run(ctx: CommandContext) {
		const msg = await ctx.message.channel.send('Ping ?');
		const botPing = ctx.handler.client?.ws.ping;
		const apiPing = msg.createdTimestamp - ctx.message.createdTimestamp;
		await msg.edit(`Bot Latency: **${botPing}**ms\nAPI Latency: **${apiPing}**ms`);
	}
}
