import {Permissions, type PermissionString} from 'discord.js';

/**
 * The list of all permissions.
 */
const PERMISSIONS = Object.fromEntries(Object.keys(Permissions.FLAGS).map(key => [key, key])) as Record<PermissionString, PermissionString>;

export {PERMISSIONS as Permissions};
