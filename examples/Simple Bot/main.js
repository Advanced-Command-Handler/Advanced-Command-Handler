const {CommandHandler} = require('src/index.js');

CommandHandler.create({
	commandsDir: 'commands',
	eventsDir: 'events',
	prefixes: [';', 'bot!']
})

CommandHandler.launch({
	token: 'NTk0Njg3MjM3NDkzNDg5Njk5.XpnVTA.3Vpu_6bvv6D-b6fo75PKISCMsWI'
});
