const {argError, CommandHandler, Event, getThing, Logger, permissionsError, Tag} = require('advanced-command-hander');

module.exports = new Event(
	{
		name: 'message',
	},
	async (handler, message) => {
		if (message.author.bot || message.system) return;

		const prefix = CommandHandler.getPrefixFromMessage(message);
		console.log(prefix);
		console.log(message.content);
		if (!prefix) return;
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const cmd = await getThing('command', args[0].toLowerCase().normalize());
		args.shift();

		if (cmd && cmd.isInRightChannel(message)) {
			const missingPermissions = cmd.getMissingPermissions(message);
			const missingTags = cmd.getMissingTags(message);

			if (missingPermissions.client.length) return permissionsError(message, missingPermissions.client, cmd, true);
			if (missingPermissions.user.length) return permissionsError(message, missingPermissions.user, cmd);

			if (missingTags.length)
				return argError(
					message,
					`You are missing the following tags: \n\`${missingTags
						.map(tag => Object.keys(Tag).filter(t => Tag[t] === tag))
						.sort()
						.join('\n')
						.toUpperCase()}\``,
					cmd
				);
			try {
				await cmd.run(handler, message, args);
				Logger.log(`${message.author.tag} has executed the command ${Logger.setColor('red', cmd.name)}.`);
			} catch (error) {
				Logger.warn(error.stack);
			}
		}
	}
);
