import {PermissionsBitField, type PermissionsString} from 'discord.js';

/**
 * The list of all permissions.
 */
const PERMISSIONS = Object.fromEntries(Object.keys(PermissionsBitField.Flags).map(key => [
	key,
	key,
])) as Record<PermissionsString, PermissionsString>;

export {PERMISSIONS as Permissions};
