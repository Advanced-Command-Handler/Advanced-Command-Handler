/** @module functions/getThing */

const client = require('../main.js');
/**
 * Let you get a {thing} into your Client, or the {text}.
 * @param {'command'|'channel'|'guild'|'member'|'user'|'role'|'emote'|'message'} dataType - The type of data to search
 * @param {String|Object} text - Text or Message where to look for the dataType.
 * @return {Promise<Command|GuildChannel|TextChannel|Guild|GuildMember|User|Role|Emoji|Message|boolean>}
 */
module.exports = async (dataType, text) => {
	const message = text.content && text.content instanceof String ? text : null;
	
	switch (dataType) {
		case 'command':
			return client.commands.find((c) => c.name === text
					|| c.aliases && c.aliases.includes(text))
				|| false;
		case 'channel':
			return message.guild.channels.get(text)
				|| message.mentions.channels.first()
				|| message.guild.channels.find((c) => {
					return c.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1;
				})
				|| false;
		case 'guild':
			return client.guilds.get(text)
				|| client.guilds.find((g) => g.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1)
				|| false;
		case 'member':
			return message.guild.members.get(text)
				|| message.mentions.members.first()
				|| message.guild.members.find((m) => (m.displayName.toLowerCase().includes(text.toLowerCase())
					|| m.user.username.toLowerCase().includes(text.toLowerCase()))
					&& text.length > 1)
				|| false;
		case 'user':
			return client.users.get(text)
				|| client.users.find((u) => u.username.toLowerCase() === text.toLowerCase())
				|| message.mentions.users.first()
				|| false;
		case 'role':
			return message.guild.roles.get(text)
				|| message.mentions.roles.first()
				|| message.guild.roles.find((r) => r.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1)
				|| false;
		case 'emote':
			return client.emojis.get(text)
				|| client.emojis.find((e) => e.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1)
				|| false;
		case 'message':
			
			if (text.length < 7) return false;
			const m = await message.channel.fetchMessage(text);
			if (m) return m;
			
			const url = message.replace('https://discordapp.com/channels/', '').split('/');
			if (message.startsWith('https') && client.channels.has(url[1])) {
				return (await client.channels.get(url[1]).fetchMessage(url[2])) || false;
			}
			
			for (const channel of client.channels) {
				const m = await channel[1].fetchMessage(text);
				if (m) return m;
			}
			return false;
	}
};