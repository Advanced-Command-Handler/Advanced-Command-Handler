import {Message} from 'discord.js';
import CommandHandler from './CommandHandler.js';

export type RunFunction = (...options: any[]) => Promise<any>;

export type DefaultCommandRunFunction = (commandHandler: typeof CommandHandler, message: Message, args: string[]) => Promise<void>;
