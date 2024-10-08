import {CommandHandler, InteractionHandler, Logger, LogLevel} from 'advanced-command-handler';
import {GatewayIntentBits} from 'discord-api-types/v10';
import * as dotenv from 'dotenv';

dotenv.config();

// Logger.LEVEL = LogLevel.LOG;
Logger.ignores.push(['subCommandLoading', LogLevel.COMMENT]);

CommandHandler.on('create', Logger.log);
CommandHandler.on('error', Logger.error);

CommandHandler.create({
	eventsDir: 'events',
	commandsDir: 'commands',
	prefixes: ['!'],
	saveLogsInFiles: ['a.txt'],
})
	.useDefaultEvents({
		messageCreateOptions: {
			sendWhenError: 'The command has failed.',
			globalTags: ['guildOnly'],
		},
	})
	.useDefaultCommands({
		exclude: ['ping'],
		helpOptions: {
			globalMenuUseList: true,
		},
	})
	.launch({
		token: process.env.TOKEN,
		cycleDuration: 15,
		clientOptions: {
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
			],
		},
		presences: [
			{
				activities: [
					{
						name: 'Test1',
					},
				],
				status: 'idle',
			},
			{
				activities: [
					{
						name: 'Test2',
					},
				],
			},
		],
	});

InteractionHandler.create({
	slashCommandsDir: 'slashCommands',
})
	.useDefaultSlashCommands()
	.createInteractions();

CommandHandler.on('launched', () => {
	Logger.log('CommandHandler launched successfully !');
	CommandHandler.unloadCommand('tests');
});

InteractionHandler.on('launched', () => Logger.log('InteractionHandler launched successfully !'));
