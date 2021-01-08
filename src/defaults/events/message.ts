import {Message} from 'discord.js';
import {Tag} from '../../classes/Command';
import CommandHandler from '../../classes/CommandHandler';
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
					`There are missing tags for the message: \n\`${missingTags
						.map((_, index: number) => Tag[index])
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
