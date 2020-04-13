/** @module functions/argError */
const client = require('main.js');

/**
 * Send embed who explains why user failed an argument of the {Command}.
 * @param {TextChannel} channel - Channel where embed will be sent.
 * @param {String} error - The mistake user made.
 * @param {Command} command - Wich command failed.
 * @return {void}
 */
module.exports = (channel, error, command) => {
	const embed = {
		title      : `Argument error :`,
		timestamp  : Date.now(),
		color      : 0xee2200,
		description: error,
		footer     : {
			text: client.user.username
		}
	};
	
	if (command.usage) {
		embed.fields = [{
			name : 'Syntax :',
			value: command.usage
		}];
	}
	
	if (channel instanceof String) {
		if (client.channels.get(channel)) {
			channel = client.channels.get(channel);
		} else {
			 Error(`The channel ${channel} is not valid, an ID is expected, if an ID has been entered, then the bot does not have this channel.`);
		}
	}
	
	channel.send({embed});
};
