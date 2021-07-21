import {Message} from 'discord.js';
import {CommandHandler} from '../../CommandHandler.js';
import {Command} from './Command.js';

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
	 * @param message - The message to react to.
	 */
	public async startWait(message: Message) {
		await message.react(this.waitEmoji);
	}

	/**
	 * Remove the reaction {@link waitEmoji} of the bot.
	 *
	 * @param message - The message to remove the reaction to.
	 */
	public async stopWait(message: Message) {
		await message.reactions.cache.find(r => r.emoji.name === this.waitEmoji)?.users.remove(CommandHandler.client!!.id);
	}
}
