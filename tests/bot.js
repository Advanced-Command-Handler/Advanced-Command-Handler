const {CommandHandler, Logger, LogLevel} = require('advanced-command-handler');
require('dotenv').config();

// Logger.LEVEL = LogLevel.LOG;
Logger.ignores.push(['subCommandLoading', 'COMMENT']);

CommandHandler.create({
	eventsDir: 'events',
	commandsDir: 'commands',
	prefixes: ['!'],
})
	.useDefaultEvents()
	.useDefaultCommands()
	.launch({
		token: process.env.TOKEN,
	});

CommandHandler.on('create', options => Logger.log(options));

CommandHandler.on('launched', () => {
	Logger.log('CommandHandler launched successfully !');
	CommandHandler.unloadCommand('tests');
});
