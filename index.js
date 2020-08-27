const BetterEmbed = require('./utils/BetterEmbed.js');
const Command = require('./classes/Command.js');
const CommandHandler = require('./classes/CommandHandler.js');
const CommandHandlerError = require('./classes/CommandHandlerError.js');
const Logger = require('./utils/Logger.js');
const argError = require('./utils/argError.js');
const getThing = require('./utils/getThing.js');

module.exports = {
	BetterEmbed,
	Command,
	CommandHandler,
	CommandHandlerError,
	Logger,
	getThing,
	argError,
};
