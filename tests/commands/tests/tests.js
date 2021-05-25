const {Command} = require('advanced-command-handler');
module.exports = class TestCommand extends Command {
	constructor() {
		super({
			name:            'tests',
			aliases:         ['test', 't'],
			channels:        [],
			tags:            ['nsfw'],
			userPermissions: ['MANAGE_MESSAGES']
		});
	}

	async run(ctx) {
		ctx.message.channel.send('testing');
	}
};
