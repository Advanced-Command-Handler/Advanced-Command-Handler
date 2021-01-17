import { Emoji, Guild, GuildChannel, Message, Role, User } from 'discord.js';
import { Command } from '../classes/Command';
export declare enum DataType {
    command = "command",
    channel = "channel",
    guild = "emote",
    member = "guild",
    user = "user",
    role = "role",
    emote = "emote",
    message = "message"
}
export declare function getThing(dataType: DataType.channel | 'channel', text: string | Message): Promise<GuildChannel | null>;
export declare function getThing(dataType: DataType.command | 'command', text: string | Message): Promise<Command | null>;
export declare function getThing(dataType: DataType.emote | 'emote', text: string | Message): Promise<Emoji | null>;
export declare function getThing(dataType: DataType.guild | 'guild', text: string | Message): Promise<Guild | null>;
export declare function getThing(dataType: DataType.message | 'message', text: string | Message): Promise<Message | null>;
export declare function getThing(dataType: DataType.role | 'role', text: string | Message): Promise<Role | null>;
export declare function getThing(dataType: DataType.user | 'message', text: string | Message): Promise<User | null>;
