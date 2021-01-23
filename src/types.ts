import {Message} from 'discord.js';
import {CommandHandler} from './CommandHandler';

/**
 * The runFunction to use for commands and commands.
 */
export type RunFunction = (...options: any[]) => Promise<any>;

/**
 * The runFunction for the commands when using the default message event.
 */
export type DefaultCommandRunFunction = (commandHandler: typeof CommandHandler, message: Message, args: string[]) => Promise<void>;
