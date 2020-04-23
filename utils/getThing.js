const CommandHandler = require('../classes/Command Handler.js');
/**
 * Let you get a {thing} into your Client, or the {text}.
 * @param {'command'|'channel'|'guild'|'member'|'user'|'role'|'emote'|'message'} dataType - The type of data to search
 * @param {String|Object} text - Text or Message where to look for the dataType.
 * @return {Promise<Command|GuildChannel|TextChannel|Guild|GuildMember|User|Role|Emoji|Message|boolean>}
 */
module.exports = async (dataType, text) => {
	/**
	 * @type {Message | String | null}
	 */
	const message = text.hasOwnProperty('content') && text.content instanceof String ? text : null;
	
	switch (dataType) {
		case 'command':
			return CommandHandler.commands.find((c) => c.name === text
				|| c.aliases && c.aliases.includes(text))
				|| false;
		case 'channel':
			return message.guild.channels.cache.get(text)
				|| message.mentions.channels.first()
				|| message.guild.channels.cache.find((c) => {
					return c.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1;
				})
				|| false;
		case 'guild':
			return CommandHandler.client.guilds.get(text)
				|| CommandHandler.client.guilds.find((g) => g.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1)
				|| false;
		case 'member':
			return message.guild.members.cache.get(text)
				|| message.mentions.members.first()
				|| message.guild.members.cache.find((m) => (m.displayName.toLowerCase().includes(text.toLowerCase())
					|| m.user.username.toLowerCase().includes(text.toLowerCase()))
					&& text.length > 1)
				|| false;
		case 'user':
			return CommandHandler.client.users.get(text)
				|| CommandHandler.client.users.find((u) => u.username.toLowerCase() === text.toLowerCase())
				|| message.mentions.users.first()
				|| false;
		case 'role':
			return message.guild.roles.cache.get(text)
				|| message.mentions.roles.first()
				|| message.guild.roles.cache.find((r) => r.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1)
				|| false;
		case 'emote':
			return CommandHandler.client.emojis.get(text)
				|| CommandHandler.client.emojis.find((e) => e.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1)
				|| false;
		case 'message':
			if (text.length < 7) return false;
			
			const m = await message.channel.messages.fetch(text);
			if (m) return m;
			
			const url = message.replace('https://discordapp.com/channels/', '').split('/');
			if (message.startsWith('https') && CommandHandler.client.channels.has(url[1])) {
				return (await CommandHandler.client.channels.get(url[1]).messages.fetch(url[2])) || false;
			}
			
			for (const channel of CommandHandler.client.channels) {
				const m = await channel[1].messages.fetch(text);
				if (m) return m;
			}
			
			return false;
	}
};