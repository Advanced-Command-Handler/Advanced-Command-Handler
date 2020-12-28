const {
	argError,
	CommandHandler,
	getThing,
	Logger,
	permissionsError,
} = require('advanced-command-hander');

module.exports = async (handler, message) => {
	if (message.author.bot || message.system) return;

	const prefix = CommandHandler.getPrefixFromMessage(message);
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = await getThing('command', args[0].toLowerCase().normalize());
	args.shift();

	if (prefix && cmd && cmd.isInRightChannel(message)) {
		const missingPermissions = cmd.getMissingPermissions(message);
		const missingTags = cmd.getMissingTags(message);

		if (missingPermissions.client) return permissionsError(missingPermissions.client);
		if (missingPermissions.user) return permissionsError(missingPermissions.user);

		if (missingTags) return argError(`You are missing the following tags: \n\`${missingTags.sort().join('\n').toUpperCase()}\``);

		try {
			cmd.run(handler, message, args);
		} catch (error) {
			Logger.warn(error.stack);
		}
	}
};
