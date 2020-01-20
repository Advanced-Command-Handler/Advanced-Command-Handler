const client = require('../main.js');

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
	
	if(command.usage) embed.fields = [{
		name: "Syntax :",
		value: command.usage
	}];
	
	if (channel instanceof String) {
		if (client.channels.get(channel)) {
			channel = client.channels.get(channel);
		} else new Error(`The channel ${channel} is not valid, an ID is expected, if an ID has been entered, then the bot does not have this channel.`);
	}
	
	channel.send({embed});
};