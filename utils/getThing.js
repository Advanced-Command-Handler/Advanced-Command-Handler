const CommandHandler = require('../classes/CommandHandler.js');

/**
 * Let you get a {dataTyoe} from your Client, or the {text}.
 * @param {'command' | 'channel' | 'guild' | 'member' | 'user' | 'role' | 'emote' | 'message'} dataType - The type of data to search
 * @param {string | Message} text - Text or Message where to look for the dataType.
 * @returns {Promise<Command | GuildChannel | TextChannel | NewsChannel | Guild | GuildMember | User | Role | Emoji | Message | null > | Message} - The datatype result or `null`.
 */
module.exports = async (dataType, text) => {
	/**
	 * @type {Message | string | null}
	 */
	const message = text.hasOwnProperty('content') && text.content instanceof String ? text : null;

	switch (dataType) {
		case 'command':
			return CommandHandler.commands.find(c => c.name === text || (c.aliases && c.aliases.includes(text))) || null;

		case 'channel':
			return (
				message.guild.channels.cache.get(text) ||
				message.mentions.channels.first() ||
				message.guild.channels.cache.find(c => {
					return c.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1;
				}) ||
				null
			);

		case 'guild':
			return CommandHandler.client.guilds.get(text) || CommandHandler.client.guilds.find(g => g.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1) || null;

		case 'member':
			return (
				message.guild.members.cache.get(text) ||
				message.mentions.members.first() ||
				message.guild.members.cache.find(m => {
					return (m.displayName.toLowerCase().includes(text.toLowerCase()) || m.user.username.toLowerCase().includes(text.toLowerCase())) && text.length > 1;
				}) ||
				null
			);

		case 'user':
			return CommandHandler.client.users.get(text) || CommandHandler.client.users.find(u => u.username.toLowerCase() === text.toLowerCase()) || message.mentions.users.first() || null;

		case 'role':
			return (
				message.guild.roles.cache.get(text) ||
				message.mentions.roles.first() ||
				message.guild.roles.cache.find(r => r.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1) ||
				null
			);

		case 'emote':
			return CommandHandler.client.emojis.get(text) || CommandHandler.client.emojis.find(e => e.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1) || null;

		case 'message':
			const m = await message.channel.messages.fetch(text);
			if (m) return m;

			const url = message.replace('https://discord.com/channels/', '').split('/');
			if (message.startsWith('https') && CommandHandler.client.channels.has(url[1])) {
				return (await CommandHandler.client.channels.get(url[1]).messages.fetch(url[2])) || null;
			}

			for (const channel of CommandHandler.client.channels) {
				const m = await channel[1].messages.fetch(text);
				if (m) return m;
			}

			return null;
	}
};
