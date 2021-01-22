import {Message} from 'discord.js';
import {Tag} from '../../classes/Command';
import CommandHandler from '../../CommandHandler.js';
import Event from '../../classes/Event';
import argError from '../../utils/argError';
import {getThing} from '../../utils/getThing';
import {Logger} from '../../utils/Logger';
import permissionsError from '../../utils/permissionsError';

export default new Event(
	{
		name: 'message',
	},
	async (handler: typeof CommandHandler, message: Message): Promise<any> => {
		if (message.author.bot || message.system) return;

		const prefix = CommandHandler.getPrefixFromMessage(message);
		if (!prefix) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = await getThing('command', cmd.toLowerCase().normalize());

		if (command) {
			if (command.isInCooldown(message)) return message.channel.send(`You are on a cooldown! Please wait **${command.getCooldown(message).waitMore / 1000}**s.`);

			if (!command.isInRightChannel(message)) return message.channel.send(`This command is not in the correct channel.`);

			const missingPermissions = command.getMissingPermissions(message);
			const missingTags = command.getMissingTags(message);

			if (missingPermissions.client.length) return permissionsError(message, missingPermissions.client, command, true);
			if (missingPermissions.user.length) return permissionsError(message, missingPermissions.user, command);

			if (missingTags.length)
				return argError(
					message,
					`There are missing tags for the message: \n\`${missingTags
						.map(tag => Tag[tag])
						.sort()
						.join('\n')
						.toUpperCase()}\``,
					command
				);
			try {
				await command.run(handler, message, args);
				command.setCooldown(message);
				Logger.log(`${message.author.tag} has executed the command ${Logger.setColor('red', command.name)}.`);
			} catch (error) {
				Logger.warn(error.stack);
			}
		}
	}
);
