module.exports = async (dataType, text) => {
	const msg = text.content && text.content instanceof String ? text : undefined;
	const client = msg.client;
	switch (dataType) {
		case 'command':
			return client.commands.find((c) => c.name === name) || client.commands.find((c) => c.aliases !== undefined && c.aliases.includes(name)) || false;
		case 'channel':
			return msg.guild.channels.get(text) || msg.mentions.channels.first() || msg.guild.channels.find((c) => c.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1) || false;
		case 'guild':
			return client.guilds.get(text) || client.guilds.find((g) => g.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1) || false;
		case 'member':
			return msg.guild.members.get(text) || msg.mentions.members.first() || msg.guild.members.find((m) => (m.displayName.toLowerCase().includes(text.toLowerCase()) || m.user.username.toLowerCase().includes(text.toLowerCase())) && text.length > 1) || false;
		case 'user':
			return client.users.get(text) || client.users.find((u) => u.username.toLowerCase() === text.toLowerCase()) || msg.mentions.users.first() || false;
		case 'role':
			return msg.guild.roles.get(text) || msg.mentions.roles.first() || msg.guild.roles.find((r) => r.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1) || false;
		case 'emote':
			return client.emojis.get(text) || client.emojis.find((e) => e.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1) || false;
		case 'message':
			
			if (text.length < 7) return false;
			const m = await msg.channel.fetchMessage(text);
			if (m) return m;
			
			const url = msg.replace('https://discordapp.com/channels/', '').split('/');
			if (msg.startsWith('https') && client.channels.has(url[1])) return (await client.channels.get(url[1]).fetchMessage(url[2])) || false;
			
			for (let [, value] of client.channels) {
				const m = await value.fetchMessage(text);
				if (m) return m;
			}
			return false;
	}
};
