import { Client, ClientOptions, Message, PermissionResolvable, Snowflake } from 'discord.js';
export default class AdvancedClient extends Client {
    constructor(token: string, options: ClientOptions);
    hasPermission(message: Message, permission: PermissionResolvable): boolean | undefined;
    isOwner(id: Snowflake): boolean;
}
