const config = require('../informations/config.json');
const {cyanBright, greenBright, magenta, red, reset, yellowBright} = require('chalk');
const getCommand = require('../functions/getCommand.js');
const BetterEmbed = require('../classes/BetterEmbeds.js');
const moment = require('moment');

module.exports = async (client, message) => {
	
	function verifyPerms(command) {
		const clientMissingPermissions = [];
		const userMissingPermissions = [];
		if ( !message.guild.me.hasPermission('ADMINISTRATOR')) {
			if (command.hasOwnProperty('clientPermissions')) {
				command.clientPermissions.forEach(permission => {
					if ( !message.guild.me.hasPermission(permission, true, false, false)) clientMissingPermissions.push(permission);
				});
			}
			if (command.hasOwnProperty('userPermissions')) {
				command.userPermissions.forEach(permission => {
					if ( !message.member.hasPermission(permission, true, false, false)) userMissingPermissions.push(permission);
				});
			}
		}
		
		return {
			client: clientMissingPermissions,
			user  : userMissingPermissions
		};
	}
	
	function missingPermission(permissions, type) {
		const embed = new BetterEmbed();
		embed.color = '#ecc333';
		embed.title = type === 'client' ? `The bot is missing permissions.` : `The member is missing permissions.`;
		embed.description`These permissions are missing for the command to succeed : ${permissions}`;
		
		return embed.build();
	}
	
	if (message.author.bot || message.system) return;
	let prefix = false;
	for (const thisPrefix of client.prefixes) {
		if (message.content.startsWith(thisPrefix)) prefix = thisPrefix;
	}
	message.content = message.content.replace(/@everyone/gi, '**everyone**');
	message.content = message.content.replace(/@here/gi, '**here**');
	
	const messageToString = message.content.length > 1024 ? message.content.substring(0, 1021) + '...' : message.content;
	const args = message.content.slice(prefix['length']).trim().split(/ +/g);
	const cmd = getCommand(args[0].toLowerCase().normalize());
	args.shift();
	
	if (message.content
		=== prefix) {
		return message.channel.send(`The current bot prefixes are : ${config.prefixes.join('\n')}\n<@${client.user.id}>`);
	}
	
	if (cmd && prefix !== false) {
		if ( !client.isOwner(message.author.id) && (['owner', 'wip', 'mod'].includes(cmd.category) || cmd.ownerOnly)) {
			message.channel.send('You are not the creator of the bot. You do not have the right to use this command.');
			return console.log(greenBright(cmd.config.name + '.js')
				+ reset(' : ')
				+ yellowBright(message.author.tag)
				+ reset(` tried the command ${cyanBright(cmd.name)} on the guild ${magenta(message.guild.name)}.`));
		}
		
		if (message.guild === null) {
			console.log(`${greenBright('[EVENT message]')} : ${yellowBright(message.author.tag)} executed the command ${cyanBright(cmd.name)} in private messages.`);
			if (cmd.guildOnly) {
				message.channel.send('The command is only available on a guild.');
				return console.log(`${greenBright('[EVENT message]')} : ${yellowBright(message.author.tag)} tried the command ${cyanBright(cmd.name)}only available on guild but in private.`);
			}
		} else {
			console.log(`${greenBright('[EVENT message]')} : ${yellowBright(message.author.tag)} executed the command ${cyanBright(cmd.name)} on the guild ${magenta(message.guild.name)}.`);
			
			const verified = verifyPerms(cmd);
			if (verified.client.length > 0) return message.channel.send(missingPermission(verified.client, 'client'));
			if (verified.user.length > 0) return message.channel.send(missingPermission(verified.user, 'user'));
			
			if (cmd.nsfw && !message.channel.nsfw) {
				const embed = new BetterEmbed({
					title      : 'Error :',
					description: 'NSFW commands are only available on nsfw channels.',
					footer     : client.user.username,
					footer_icon: client.user.displayAvatarURL
				});
				await message.channel.send(embed.build());
			}
		}
		
		return cmd.run(client, message, args).catch((warning) => {
			console.log(red(`A small error was made somewhere with the command ${cyanBright(cmd.name)}. \nTime : `
				+ moment().format('LLLL')
				+ '\nError : '
				+ warning.stack));
			const embedLog = new BetterEmbed();
			
			embedLog.color = '#d00';
			embedLog.description = 'An error occurred with the command : **' + cmd.name + '**.';
			embedLog.fields.push({
				name : 'Informations :',
				value: `\nSent by : ${message.author} (\`${message.author.id}\`)\n\nOnto : **${message.guild.name}** (\`${message.guild.id}\`)\n\nInto : ${message.channel} (\`${message.channel.id})\``
			});
			embedLog.fields.push({
				name : 'Error :',
				value: warning.stack.length > 1024 ? warning.stack.substring(0, 1021) + '...' : warning.stack
			});
			embedLog.fields.push({
				name : 'Message :',
				value: messageToString
			});
			
			if (client.isOwner(message.author.id)) return message.channel.send(embedLog.build());
		});
	}
};
