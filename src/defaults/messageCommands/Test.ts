import type {MessageCommandContext} from '../../classes/contexts/interactions/MessageCommandContext.js';
import {MessageCommand} from '../../classes/interactions/MessageCommand.js';

export class TestMessageCommand extends MessageCommand {
	public override readonly name = 'message';

	public override async run(ctx: MessageCommandContext) {
		await ctx.reply('Test message command!');
	}
}
