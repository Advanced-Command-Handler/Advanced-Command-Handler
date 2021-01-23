import {Message} from 'discord.js';
import {CommandHandler} from './CommandHandler';

/**
 * The runFunction to use for commands.
 */
export type RunFunction = (...options: any[]) => Promise<any>;

/**
 * The runFunction to use when using the default message event.
 */
export type DefaultCommandRunFunction = (commandHandler: typeof CommandHandler, message: Message, args: string[]) => Promise<void>;
