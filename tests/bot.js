const {CommandHandler, Logger, LogLevel} = require('advanced-command-handler');
require('dotenv').config();

// Logger.LEVEL = LogLevel.LOG;
Logger.ignores.push(['subCommandLoading', 'COMMENT']);

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
		presences: [
			{
				activity: {
					name: 'Test1',
				},
				status: 'idle',
			},
			{
				activity: {
					name: 'Test2',
				}
			}
		],
	});

CommandHandler.on('create', Logger.log);

CommandHandler.on('launched', () => {
	Logger.log('CommandHandler launched successfully !');
	CommandHandler.unloadCommand('tests');
});
