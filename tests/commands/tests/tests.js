const {Command} = require('advanced-command-handler');

module.exports = class TestCommand extends Command {
	name = 'tests';
	aliases = ['test', 't'];
	tags = ['nsfw'];
	userPermissions = ['MANAGE_MESSAGES'];

	async run(ctx) {
		ctx.message.channel.send('testing');
	}
};
