const {CommandHandlerError, Logger, BetterEmbed, Command, getThing} = require('advanced-command-handler');
const {DateTime} = require('luxon');
const Discord = require('discord.js');

/**
 * Verify if the user, and the client has all the permissions of the Command.
 * @param {Message} message - The message.
 * @param {Command} command - Command to verify the permissions.
 * @returns {{client: Permissions[], user: Permissions[]}} - Missing permissions.
 */
function verifyPerms(message, command) {
	const clientMissingPermissions = [];
	const userMissingPermissions = [];
	if (!message.guild) return {
		client: clientMissingPermissions,
		user:   userMissingPermissions,
	};
	
	if (!message.guild.me.hasPermission('ADMINISTRATOR')) {
		command.clientPermissions.forEach(permission => {
			if (!Discord.Permissions.FLAGS[permission]) {
				throw new CommandHandlerError('eventMessage', `Permission '${permission}' is not a valid Permission Flag see the full list here : https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS.`);
			}
			
			if (!message.channel.permissionsFor(message.guild.me).has(permission, false)) {
				clientMissingPermissions.push(permission);
			}
		});
	}
	
	command.userPermissions.forEach(permission => {
		if (!Discord.Permissions.FLAGS[permission]) {
			throw new CommandHandlerError('eventMessage', `Permission '${permission}' is not a valid Permission Flag see the full list here : https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS.`);
		}
		
		if (!message.channel.permissionsFor(message.member).has(permission, false)) {
			userMissingPermissions.push(permission);
		}
	});
	
	return {
		client: clientMissingPermissions,
		user:   userMissingPermissions,
	};
}

/**
 * Create an Embed Objet for listing the missing permisisons of a member or a client.
 * @param {Permissions[]} permissions - The missing Permisisons.
 * @param {boolean} client - If the missing permissions are to the client.
 * @returns {object} - An Embed Object.
 */
function missingPermission(permissions, client = false) {
	const embed = new BetterEmbed();
	embed.color = '#ecc333';
	embed.title = client ? 'The bot is missing permissions.' : 'The member is missing permissions.';
	embed.description = `These permissions are missing for the command to succeed : ${permissions}`;
	
	return embed.build();
}

module.exports = async (handler, message) => {
	if (message.author.bot || message.system) return;
	
	let prefix = '';
	for (const thisPrefix of handler.prefixes) {
		if (message.content.startsWith(thisPrefix)) {
			prefix = thisPrefix;
		}
	}
	
	const messageToString = message.content.length > 1024 ? message.content.substring(0, 1021) + '...' : message.content;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	/**
	 * The command that have been searched through the message content.
	 * @type {Command | null} -
	 */
	const cmd = await getThing('command', args[0].toLowerCase().normalize());
	args.shift();
	
	if (message.content === prefix) return message.channel.send(`The current bot prefixes are : ${handler.prefixes.join('\n')}`);
	
	if (cmd && prefix) {
		if (!handler.client.isOwner(message.author.id) && (['owner', 'wip', 'mod'].includes(cmd.category) || cmd.ownerOnly)) {
			await message.channel.send('You are not the creator of the bot. You do not have the right to use this command.');
			return Logger.log(`${Logger.setColor('magenta', message.author.tag)} tried the ownerOnly command ${Logger.setColor('gold', cmd.name)} on the guild ${Logger.setColor('teal', message.guild.name)}.`);
		}
		
		if (message.guild) {
			Logger.log(`${Logger.setColor('magenta', message.author.tag)} executed the command ${Logger.setColor('gold', cmd.name)} on the guild ${Logger.setColor('teal', message.guild.name)}.`);
			
			const verified = verifyPerms(message, cmd);
			if (verified.client.length > 0) return message.channel.send({embed: missingPermission(verified.client, true)});
			if (verified.user.length > 0) return message.channel.send({embed: missingPermission(verified.user)});
			
			if (cmd.nsfw && !message.channel.nsfw) {
				const embed = new BetterEmbed({
					title:       'Error :',
					description: 'NSFW commands are only available on nsfw channels.',
					footer:      handler.client.user.username,
					footer_icon: handler.client.user.displayAvatarURL,
				});
				await message.channel.send(embed.build());
			}
		} else {
			Logger.log(`${Logger.setColor('magenta', message.author.tag)} executed the command ${Logger.setColor('gold', cmd.name)} in private messages.`);
			if (cmd.guildOnly) {
				await message.channel.send('The command is only available on a guild.');
				return Logger.log(`${Logger.setColor('magenta', message.author.tag)} tried the command ${Logger.setColor('gold', cmd.name)} only available on guild but in private.`);
			}
		}
		
		return cmd.run(handler.client, message, args).catch((warning) => {
			Logger.warn(`A small error was made somewhere with the command ${Logger.setColor('gold', cmd.name)}.
Date : ${Logger.setColor('yellow', DateTime.local().toFormat('TT'))}${Logger.setColor('red', '\nError : ' + warning.stack)}`);
			
			
			if (handler.client.isOwner(message.author.id)) {
				const embedLog = new BetterEmbed();
				embedLog.color = '#dd0000';
				embedLog.description = 'An error occurred with the command : **' + cmd.name + '**.';
				embedLog.fields.push({
					name:  'Informations :',
					value: `\nSent by : ${message.author} (\`${message.author.id}\`)\n\nOnto : **${message.guild.name}** (\`${message.guild.id}\`)\n\nInto : ${message.channel} (\`${message.channel.id})\``,
				});
				
				embedLog.fields.push({
					name:  'Error :',
					value: warning.stack.length > 1024 ? warning.stack.substring(0, 1021) + '...' : warning.stack,
				});
				
				embedLog.fields.push({
					name:  'Message :',
					value: messageToString,
				});
				
				return message.channel.send(embedLog.build());
			}
		});
	}
};
