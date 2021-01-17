/// <reference types="node" />
import { ClientOptions, Collection, Message, Snowflake } from 'discord.js';
import { EventEmitter } from 'events';
import AdvancedClient from './AdvancedClient';
import { Command } from './Command';
import CommandHandlerError from './CommandHandlerError';
import Event from './Event';
declare namespace CommandHandler {
    export interface CreateCommandHandlerOptions {
        commandsDir: string;
        eventsDir: string;
        owners?: string[];
        prefixes?: string[];
    }
    export interface CommandCooldown {
        executedAt: Date;
        cooldown: number;
    }
    export type CooldownUser = {
        [k: string]: CommandCooldown;
    };
    type CommandHandlerEvents = {
        create: [CreateCommandHandlerOptions];
        error: [CommandHandlerError];
        launch: [];
        loadCommand: [Command];
        loadEvent: [Event];
        launched: [];
    };
    export const version: string;
    export const emitter: EventEmitter;
    export const commands: Collection<string, Command>;
    export const cooldowns: Collection<Snowflake, CooldownUser>;
    export const events: Collection<string, Event>;
    export let commandsDir: string;
    export let eventsDir: string;
    export let owners: string[];
    export let prefixes: string[];
    export let client: AdvancedClient | null;
    export function on<K extends keyof CommandHandlerEvents>(eventName: K, fn: (listener: CommandHandlerEvents[K]) => void): void;
    export function emit<K extends keyof CommandHandlerEvents>(eventName: K, ...args: CommandHandlerEvents[K]): void;
    export function setDefaultEvents(): typeof CommandHandler;
    export function setDefaultCommands(): typeof CommandHandler;
    export function create(options: CreateCommandHandlerOptions): typeof CommandHandler;
    export function launch(options: {
        token: string;
        clientOptions?: ClientOptions;
    }): Promise<typeof CommandHandler>;
    export function getPrefixFromMessage(message: Message): string | null;
    export function loadCommand(path: string, name: string): Promise<void>;
    export function loadCommands(path: string): Promise<void>;
    export function loadEvents(path: string): Promise<void>;
    export function loadEvent(event: Event | (Event & {
        default: Event;
    })): Event;
    export {};
}
export default CommandHandler;
