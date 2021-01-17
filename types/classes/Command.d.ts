import { Message, PermissionString, Snowflake, TextChannel } from 'discord.js';
import { DefaultCommandRunFunction, RunFunction } from '../types';
export declare enum Tag {
    guildOnly = 0,
    ownerOnly = 1,
    nsfw = 2,
    guildOwnerOnly = 3,
    dmOnly = 4
}
interface CommandOptions {
    readonly name: string;
    aliases?: string[];
    category?: string;
    channels?: Array<Snowflake | TextChannel>;
    clientPermissions?: PermissionString[];
    cooldown?: number;
    description?: string;
    tags?: Tag[];
    usage?: string;
    userPermissions?: PermissionString[];
}
interface DeleteMessageOptions {
    message: Message;
    options?: {
        timeout?: number;
        reason?: string;
    };
}
interface MissingPermissions {
    client: PermissionString[];
    user: PermissionString[];
}
export declare class Command implements CommandOptions {
    readonly name: string;
    aliases: string[];
    category: string;
    channels: Array<Snowflake | TextChannel>;
    clientPermissions: PermissionString[];
    cooldown: number;
    description: string;
    tags: Tag[];
    usage: string;
    userPermissions: PermissionString[];
    run: RunFunction | DefaultCommandRunFunction;
    constructor(options: CommandOptions, runFunction: RunFunction | DefaultCommandRunFunction);
    deleteMessage({ message, options }: DeleteMessageOptions): Promise<Message> | undefined;
    getMissingPermissions(message: Message): MissingPermissions;
    getInvalidPermissions(): {
        user: PermissionString[];
        client: PermissionString[];
    };
    getMissingTags(message: Message): Tag[];
    isInRightChannel(message: Message): boolean;
    isInCooldown(message: Message): boolean;
    getCooldownTime(message: Message): {
        waitMore: number;
        executedAt: Date;
        cooldown: number;
    };
    setCooldown(message: Message): void;
}
export {};
