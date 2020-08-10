/** @module events/message */

const config = require('../informations/config.json');
const Logger = require('../utils/Logger.js');
const getCommand = require('../utils/getThing.js');
const BetterEmbed = require('../utils/BetterEmbed.js');
const {DateTime} = require('luxon');

/**
 * The event message.
 * @param {Object} client - The client the event stand for.
 * @param {Object} message - The message which is recovered by the event.
 * @return {void}
 */
module.exports = async (client, message) => {
	
	/**
	 * Verify if the user and the client has all the permissions of the Command.
	 * @param {Command} command - Command to verify the permissions.
	 * @return {{client: [], user: []}}
	 */
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
	
	/**
	 * Creates an Embed Objet for listing the missing permisisons of an member or a client.
	 * @param {Permissions[]} permissions - The missing Permisisons.
	 * @param {Boolean} client - If the missing permissions are to the client.
	 * @return {Object} - An Embed Object.
	 */
	function missingPermission(permissions, client = false) {
		const embed = new BetterEmbed();
		embed.color = '#ecc333';
		embed.title = client ? `The bot is missing permissions.` : `The member is missing permissions.`;
		embed.description`These permissions are missing for the command to succeed : ${permissions}`;
		
		return embed.build();
	}
	
	if (message.author.bot || message.system) return;
	let prefix = false;
	for (const thisPrefix of client.prefixes) {
		if (message.content.startsWith(thisPrefix)) prefix = thisPrefix;
	}
	message.content = message.content.replace(/@everyone/g, '**everyone**');
	message.content = message.content.replace(/@here/g, '**here**');
	
	const messageToString = message.content.length > 1024 ? message.content.substring(0, 1021) + '...' : message.content;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	/**
	 * Command to find within the first word after the prefix.
	 * @type {Command|false} - Command find or false.
	 */
	const cmd = await getCommand('command', args[0].toLowerCase().normalize());
	args.shift();
	
	if (message.content === prefix) {
		return message.channel.send(`The current bot prefixes are : ${config.prefixes.join('\n')}\n<@${client.user.id}>`);
	}
	
	if (cmd && prefix !== false) {
		if ( !client.isOwner(message.author.id) && (['owner', 'wip', 'mod'].includes(cmd.category) || cmd.ownerOnly)) {
			message.channel.send('You are not the creator of the bot. You do not have the right to use this command.');
			return Logger.log(`${
				Logger.setColor('magenta', message.author.tag)} tried the ownerOnly command ${
				Logger.setColor('gold', cmd.name)} on the guild ${
				Logger.setColor('teal', message.guild.name)
			}.`);
		}
		
		if (message.guild === null) {
			Logger.log(`${
				Logger.setColor('magenta', message.author.tag)} executed the command ${
				Logger.setColor('gold', cmd.name)} in private messages.`
			);
			if (cmd.guildOnly) {
				message.channel.send('The command is only available on a guild.');
				return Logger.log(`${
					Logger.setColor('magenta', message.author.tag)} tried the command ${
					Logger.setColor('gold', cmd.name)} only available on guild but in private.`
				);
			}
		} else {
			Logger.log(`${
				Logger.setColor('magenta', message.author.tag)} executed the command ${
				Logger.setColor('gold', cmd.name)} on the guild ${
				Logger.setColor('teal', message.guild.name)}.`
			);
			
			const verified = verifyPerms(cmd);
			if (verified.client.length > 0) return message.channel.send(missingPermission(verified.client, true));
			if (verified.user.length > 0) return message.channel.send(missingPermission(verified.user));
			
			if (cmd.nsfw && !message.channel.nsfw) {
				const embed = BetterEmbed.fromTemplate('basic', {client: client};
				embed.title = 'Error :',
				embed.description = 'NSFW commands are only available on nsfw channels.',
				await message.channel.send(embed.build());
			}
		}
		
		return cmd.run(client, message, args).catch((warning) => {
			Logger.warn(`A small error was made somewhere with the command ${
				Logger.setColor('gold', cmd.name)}. \nDate : ${
				Logger.setColor('yellow', DateTime.local().toFormat('TT'))}${
				Logger.setColor('red', '\nError : ' + warning.stack)}`
			);
			
			
			if (client.isOwner(message.author.id)) {
				const embedLog = new BetterEmbed();
				embedLog.color = '#dd0000';
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
				
				return message.channel.send(embedLog.build());
			}
		});
	}
}
