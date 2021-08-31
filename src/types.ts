import type {NewsChannel, TextChannel} from 'discord.js';
import {Command, Event} from './classes';

export type Constructor<T extends {} = {}> = new (...args: any[]) => T;
export type MaybeCommand = Constructor<Command> | {default: Constructor<Command>} | {[k: string]: Constructor<Command>};
export type MaybeEvent = Constructor<Event> | {default: Constructor<Event>} | {[k: string]: Constructor<Event>};
export type TextChannelLike = TextChannel | NewsChannel;
export type MaybePromise<T> = Promise<T> | T;
