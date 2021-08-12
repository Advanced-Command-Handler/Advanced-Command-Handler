const {CommandHandler, Logger, LogLevel} = require('advanced-command-handler');
require('dotenv').config();

// Logger.LEVEL = LogLevel.LOG;
Logger.ignores.push(['subCommandLoading', 'COMMENT']);

CommandHandler.on('create', Logger.log);
CommandHandler.on('error', Logger.error);

CommandHandler.create({
	eventsDir: 'events',
	commandsDir: 'commands',
	prefixes: ['!'],
	saveLogsInFile: ['a.txt'],
})
	.useDefaultEvents()
	.useDefaultCommands()
	.launch({
		token: process.env.TOKEN,
		cycleDuration: 15,
        clientOptions: {
            intents: ['GUILDS', 'GUILD_MESSAGES'],
        },
		presences: [
			{
				activities: [{
					name: 'Test1',
				}],
				status: 'idle',
			},
			{
				activities: [{
					name: 'Test2',
				}]
			}
		],
	});

CommandHandler.on('launched', () => {
	Logger.log('CommandHandler launched successfully !');
	CommandHandler.unloadCommand('tests');
});
