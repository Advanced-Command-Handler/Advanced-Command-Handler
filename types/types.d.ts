import { Message } from 'discord.js';
import CommandHandler from './CommandHandler.js';
export declare type RunFunction = (...options: any[]) => Promise<any>;
export declare type DefaultCommandRunFunction = (commandHandler: typeof CommandHandler, message: Message, args: string[]) => Promise<void>;
