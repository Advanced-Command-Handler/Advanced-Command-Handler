import type {CommandContext} from '../contexts/CommandContext.js';
import {Command} from './Command.js';

/**
 * @see {@link https://ayfri.gitbook.io/advanced-command-handler/concepts/commands/templates}
 */
export abstract class SlowCommand extends Command {
	/**
	 * The emoji for waiting.
	 *
	 * @remarks
	 * Feel free to modify the emoji to use a custom one.
	 */
	public waitEmoji = ':hourglass_flowing_sand:';

	/**
	 * Reacts with the {@link waitEmoji}.
	 *
	 * @param ctx - The context to react to.
	 */
	public async startWait(ctx: CommandContext) {
		await ctx.react(this.waitEmoji);
	}

	/**
	 * Remove the reaction {@link waitEmoji} of the bot.
	 *
	 * @param ctx - The context to remove the reaction to.
	 */
	public async stopWait(ctx: CommandContext) {
		await ctx.removeSelfReaction(this.waitEmoji);
	}
}
