const {
	argError,
	CommandHandler,
	getThing,
	Logger,
	permissionsError
} = require('advanced-command-hander');

module.exports = async (handler, message) => {
	if (message.author.bot || message.system) return;

	const prefix = CommandHandler.getPrefixFromMessage(message);
	if (!prefix) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = await getThing('command', args[0].toLowerCase().normalize());
	console.log(handler.commands);
	args.shift();

	if (cmd && cmd.isInRightChannel(message)) {
		const missingPermissions = cmd.getMissingPermissions(message);
		const missingTags = cmd.getMissingTags(message);

		if (missingPermissions.client) return permissionsError(missingPermissions.client);
		if (missingPermissions.user) return permissionsError(missingPermissions.user);

		if (missingTags) return argError(`You are missing the following tags: \n\`${missingTags.sort().join('\n').toUpperCase()}\``);
		try {
			cmd.run(handler, message, args);
			Logger.log(`${message.author.tag} has executed the command ${cmd.name}.`);
		} catch (error) {
			Logger.warn(error.stack);
		}

	}
};
