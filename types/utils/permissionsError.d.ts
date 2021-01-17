import { Message, PermissionString } from 'discord.js';
import { Command } from '../classes/Command';
declare const _default: (message: Message, missingPermissions: PermissionString[], command: Command, fromClient?: boolean) => Promise<Message>;
export default _default;
