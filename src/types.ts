import {Message} from 'discord.js';
import {Command} from './classes/Command.js';
import {Event} from './classes/Event.js';
import {CommandHandler} from './CommandHandler';

/**
 * The runFunction to use for commands and commands.
 */
export type RunFunction = any[];

/**
 * The runFunction for the commands when using the default message event.
 */
export type StringLiteral<T> = T extends string ? string extends T ? never : T : never;

export type Constructor<T extends {} = {}> = new (...args: any[]) => T;
export type MaybeCommand = Constructor<Command> | {default: Constructor<Command>};
export type MaybeEvent = Constructor<Event> | {default: Constructor<Event>};
