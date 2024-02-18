import {type Message} from 'discord.js';
import {Tag} from '../../classes/commands/Command.js';
import {CommandContext} from '../../classes/contexts/CommandContext.js';
import {type EventContext} from '../../classes/contexts/EventContext.js';
import {CommandErrorType} from '../../classes/errors/CommandError.js';
import {Event} from '../../classes/Event.js';
import {CommandHandler} from '../../CommandHandler.js';
import {argError} from '../../utils/argError.js';
import {codeError} from '../../utils/codeError.js';
import {getThing} from '../../utils/getThing.js';
import {Logger} from '../../utils/Logger.js';
import {permissionsError} from '../../utils/permissionUtils.js';
import {isOwner} from '../../utils/utils.js';
import MessageCreateOptions = CommandHandler.MessageCreateOptions;

export class MessageCreateEvent extends Event {
	public static options: MessageCreateOptions = {};
	override readonly name = 'messageCreate';

	public override async run(ctx: EventContext<this>, message: Message) {
		if (MessageCreateEvent.options.excludeBots !== false && message.author.bot) return;
		if (message.system) return;

		const prefix = CommandHandler.getPrefixFromMessage(message);
		if (!prefix) return;

		const [commandArg, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = await getThing('command', commandArg.toLowerCase().normalize());
		if (!command) return;

		const commandContext = new CommandContext({
			rawArgs: args,
			command,
			message,
			handler: ctx.handler,
		});

		if (MessageCreateEvent.options.globalTags) {
			const missingTags = Tag.check(commandContext, MessageCreateEvent.options.globalTags);
			if (missingTags.length > 0) {
				return argError(
					commandContext,
					`There are missing global tags for the message: \n\`${missingTags
						.map(tag => Tag[tag])
						.sort()
						.join('\n')
						.toUpperCase()}\``
				);
			}
		}

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
					case CommandErrorType.ARGUMENT_NOT_FOUND:
						return argError(commandContext, error.message.replaceAll(/'(\w+?)'/g, '`$1`'));
					case CommandErrorType.INVALID_ARGUMENT:
						return argError(commandContext, error.message.replaceAll(/'(\S+?)'/g, '`$1`'));
				}
			} else {
				Logger.log(`${message.author.tag} has executed the command ${Logger.setColor('red', command.name)}.`);
			}
		} catch (error) {
			const sendWhenError = MessageCreateEvent.options.sendWhenError;
			const toSend = typeof sendWhenError === 'string' ? {content: sendWhenError} : {embed: sendWhenError};
			const err = error instanceof Error ? error : new Error(String(error));

			if (MessageCreateEvent.options.sendCodeError === false) {
				if (sendWhenError) await commandContext.reply(toSend);
			} else if (MessageCreateEvent.options.sendCodeErrorOnlyToOwners === false) {
				await codeError(commandContext, err);
			} else {
				if (isOwner(commandContext.user.id)) await codeError(commandContext, err);
				else if (sendWhenError) await commandContext.reply(toSend);
			}
		}
	}
}
