import {Message} from 'discord.js';
import {Command, Tag} from '../../classes/Command';
import {CommandHandler} from '../../CommandHandler';

export default new Command(
	{
		name: 'ping',
		tags: [Tag.guildOnly],
		userPermissions: ['MANAGE_MESSAGES'],
		category: 'utils',
	},
	async (handler: typeof CommandHandler, message: Message) => {
		const msg = await message.channel.send('Ping ?');
		const botPing = handler.client?.ws.ping;
		const apiPing = msg.createdTimestamp - message.createdTimestamp;
		await msg.edit(`Bot Latency: **${botPing}**ms\nAPI Latency: **${apiPing}**ms`);
	}
);
