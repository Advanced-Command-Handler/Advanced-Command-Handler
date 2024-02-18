import type {Command} from './classes/commands/Command.js';
import type {SlashCommand} from './classes/interactions/SlashCommand.js';

export type Constructor<T extends {} = {}> = new (...args: any[]) => T;

export type MaybeClass<T extends {}> =
	| Constructor<T>
	| {
			default: Constructor<T>;
	  }
	| {
			[k: string]: Constructor<T>;
	  };
export type MaybeCommand = MaybeClass<Command>;
export type MaybeEvent = MaybeClass<Event>;
export type MaybeSlashCommand = MaybeClass<SlashCommand>;
