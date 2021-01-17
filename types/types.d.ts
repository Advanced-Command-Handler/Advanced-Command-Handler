import { Message } from 'discord.js';
import CommandHandler from './classes/CommandHandler';
export declare type RunFunction = (...options: any[]) => Promise<any>;
export declare type DefaultCommandRunFunction = (commandHandler: typeof CommandHandler, message: Message, args: string[]) => Promise<void>;
