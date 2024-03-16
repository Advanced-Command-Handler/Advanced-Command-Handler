import {promises as fsPromises} from 'fs';
import {join} from 'path';
import {inspect} from 'util';
import {CommandHandlerError} from '../classes/errors/CommandHandlerError.js';
import type {MaybeClass} from '../types.js';

/**
 * Load a class from a file, checking if the class is valid.
 * Also search for the default export if the class is a module.
 * If the object can't be resolved, an error will be thrown.
 *
 * @param path - The path to the file.
 * @param name - The name of the file.
 * @returns The object.
 * @throws CommandHandlerError - If the object can't be resolved.
 */
export async function loadClass<T extends object, C extends MaybeClass<T> = MaybeClass<T>>(path: string, name: string): Promise<C> {
	const finalPath = join(process.cwd(), path, name);
	const onWindows = process.platform === 'win32';

	let object: C = await import(onWindows ? `file:///${finalPath}` : finalPath);

	if ('default' in object && object.default && object.default.constructor.name === 'Object') object = Object.values(object.default)[0];
	else if ('constructor' in object && object.constructor && object.constructor.name === 'Object') object = Object.values(object)[0];
	else object = Object.values(object)[0];

	if (!object.constructor)
		throw new CommandHandlerError(`Command given name or path is not valid.\nPath: '${finalPath}'\nReceived object: ${inspect(object)}`, 'ClassLoading');

	return object;
}

/**
 * Loads a complete folder from a path, searches in subfolders, then returns the map of files with the path as the key.
 *
 * @param path - The path to the folder.
 * @returns The map of the files with the path as the key.
 */
export async function loadCategoriesFiles(path: string): Promise<Map<string, string>> {
	const finalPath = join(process.cwd(), path);
	const classes = new Map<string, string>();

	const dirs = await fsPromises.readdir(finalPath);
	for (const dir of dirs) {
		const dirPath = join(finalPath, dir);
		const files = await fsPromises.readdir(dirPath);
		for (const file of files) {
			classes.set(dir, file);
		}
	}

	return classes;
}
