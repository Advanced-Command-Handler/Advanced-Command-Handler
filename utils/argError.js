const {client} = require('../classes/CommandHandler.js');
const {Snowflake} = require('discord.js');

/**
 * Send embed who explains why user failed an argument of the Command.
 * @param {Snowflake} channelID - Channel where embed will be sent.
 * @param {string} error - The mistake user made.
 * @param {Command} command - Wich command failed.
 * @returns {void}
 */
module.exports = async (channelID, error, command) => {
	let channel;
	const embed = {
		title:       'Argument error :',
		timestamp:   Date.now(),
		color:       0xee2200,
		description: error,
		footer:      {
			text: client.user.username,
		},
	};
	
	if (command.usage) {
		embed.fields = [
			{
				name:  'Syntax :',
				value: command.usage,
			},
		];
	}
	
	if (channelID instanceof Snowflake) {
		if (client.channels.get(channelID)) {
			channel = await client.channels.fetch(channelID.toString());
		} else {
			throw new Error(`The channel ${channelID} is not valid, an ID is expected, if an ID has been entered, then the bot does not have this channel.`);
		}
	}
	
	channel.send({embed});
};
