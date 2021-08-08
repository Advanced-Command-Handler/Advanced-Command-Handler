import {Message} from 'discord.js';
import {CommandContext, CommandErrorType, Event, EventContext, Tag} from '../../classes';
import {CommandHandler} from '../../CommandHandler';
import {argError, codeError, getThing, Logger, permissionsError} from '../../utils';

export class MessageEvent extends Event {
	name = 'message' as const;

	public override async run(ctx: EventContext<this>, message: Message) {
		if (message.author.bot || message.system) return;

		const prefix = CommandHandler.getPrefixFromMessage(message);
		if (!prefix) return;

		const [commandArg, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = await getThing('command', commandArg.toLowerCase().normalize());
		if (!command) return;

		const commandContext = new CommandContext({args, command, message, handler: ctx.handler});

		try {
			const error = await command.execute(commandContext);

			if (error) {
				switch (error.type) {
					case CommandErrorType.CLIENT_MISSING_PERMISSIONS:
						return permissionsError(commandContext, error.data, true);
					case CommandErrorType.USER_MISSING_PERMISSIONS:
						return permissionsError(commandContext, error.data);
					case CommandErrorType.MISSING_TAGS:
						return argError(
							commandContext,
							`There are missing tags for the message: \n\`${(error.data as Tag[])
								.map(tag => Tag[tag])
								.sort()
								.join('\n')
								.toUpperCase()}\``
						);
					case CommandErrorType.WRONG_CHANNEL:
						return commandContext.send('This command is not in the correct channel.');
					case CommandErrorType.COOLDOWN:
						return commandContext.send(`You are on a cooldown! Please wait **${error.data.waitMore / 1000}**s.`);
					case CommandErrorType.ERROR:
						return codeError(commandContext, error);
				}
			} else {
				Logger.log(`${message.author.tag} has executed the command ${Logger.setColor('red', command.name)}.`);
			}
		} catch (error) {
			await codeError(commandContext, error);
		}
	}
}
