/**
 * Send embed who explains why user failed an argument of the Command.
 * @param {module:"discord.js".Message} message - Channel where embed will be sent.
 * @param {string} error - The mistake user made.
 * @param {Command} command - Which command failed.
 * @returns {void}
 */
module.exports = (message, error, command) => {
	const embed = {
		title: 'Argument error :',
		timestamp: Date.now(),
		color: 0xee2200,
		description: error,
		footer: {
			text: message.client.user.username,
		},
	};

	if (command.usage) {
		embed.fields = [
			{
				name: 'Syntax :',
				value: command.usage,
			},
		];
	}

	if (message.client.channels.cache.has(message.channel.id)) message.channel.send({embed});
	else throw new Error(`The channel ${message} is not valid, an ID is expected, if an ID has been entered, then the bot does not have this channel.`);
};
