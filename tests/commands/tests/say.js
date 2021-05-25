const {Command} = require('advanced-command-handler');

module.exports = class SayCommand extends Command {
	constructor() {
		super({
				name:            'say',
				tags:            ['guildOnly'],
				userPermissions: ['MANAGE_MESSAGES'],
				cooldown:        10,
			}
		);
	}

	async run(ctx) {
		ctx.message.channel.send(ctx.args.length ? ctx.argString : 'You must specify a message.');
	}
}
