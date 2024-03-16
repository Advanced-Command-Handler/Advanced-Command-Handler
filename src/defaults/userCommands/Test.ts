import type {UserCommandContext} from '../../classes/contexts/interactions/UserCommandContext.js';
import {UserCommand} from '../../classes/interactions/UserCommand.js';

export class TestUserCommand extends UserCommand {
	public override readonly name = 'test';

	public override async run(ctx: UserCommandContext) {
		await ctx.reply('Test command!');
	}
}
