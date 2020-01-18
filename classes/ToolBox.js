const {client} = require('../main.js');
const {RichEmbed} = require('discord.js');
const {writeFile} = require('fs');

module.exports = class ToolBox {
	static isOwner(id) {
		return client['owners'].includes(id);
	}
	
	static getCommand(name) {
		return client.commands.find((c) => c.name === name) || client.commands.find((c) => c.aliases !== undefined && c.aliases.includes(name)) || false;
	}
	
	static argError(channel, error, command) {
		const embed = {
			title      : `Argument error :`,
			timestamp  : Date.now(),
			color      : 0xee2200,
			description: error,
			footer     : {
				text: client.user.username
			}
		};
		
		if (channel instanceof String) if (client.channels.get(channel)) {
			channel = client.channels.get(channel);
		} else return new Error(`The channel ${channel} is not valid, an ID is expected, if an ID has been entered, then the bot does not have this channel.`);
		return channel.send({embed});
	}
	
	static hasPermissionClient(message, permission) {
		return message.guild === null || message.guild === undefined ? false : message.guild.me.hasPermission(permission, true, false, false);
	}
	
	static hasPermissionMember(member, permission) {
		return member.permissions.has(permission, true, false, false);
	}
	
	static deleteMessage(message) {
		if (ToolBox.hasPermissionClient('MANAGE_MESSAGES')) message.delete();
	}
	
	static missingPermission(permissions, type) {
		
		const embed = ToolBox.embedGenerated();
		embed.setColor('#ecc333');
		if (type === 'client') embed.setTitle(`The bot is missing permissions.`); else embed.setTitle(`The member is missing permissions.`);
		embed.setDescription(`These permissions are missing for the command to succeed : ${permissions}`);
		
		return embed;
	}
	
	static embedGenerated(data) {
		const e = new RichEmbed(data);
		e.setTimestamp();
		e.setFooter(client.user.username, client.user.displayAvatarURL);
		
		return e;
	}
	
	static random(array) {
		return array[Math.floor(Math.random() * array.length)];
	}
	
	static async getThing(dataType, msg, text) {
		const client = msg.client;
		switch (dataType) {
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
			default:
				break;
		}
	}
};