import * as fs from 'fs';
import {Logger} from './Logger.js';

export type JSONLike = {[k: string]: any[] | number | string | JSONLike};

/**
 * @param path - The path of the JSON file.
 * @param content - The content to save.
 * @returns - True if operation has successfully worked.
 */
export function saveJSON(path: string, content: any): boolean {
	if (!fs.existsSync(path)) {
		Logger.warn(`Cannot save JSON content to '${path}', file not found.`);
		return false;
	}

	if ((typeof content === 'string' && content.length === 0) || JSON.stringify(content, null, 4).length === 0) {
		Logger.warn(`Cannot save JSON content to '${path}', content is empty.`);
		return false;
	}

	fs.writeFile(path, JSON.stringify(content, null, 4), err => {
		if (err) Logger.error(`Cannot save JSON content to '${path}', error:\n${err.stack}`);
		return false;
	});

	return true;
}

/**
 * Reads a JSON through its path.
 *
 * @remarks
 * Prefer using `import` or `require`.
 *
 * @param path - The path to the JSON file.
 * @returns The JSON.
 */
export function readJSON(path: string): any;
/**
 * Reads a JSON through its path.
 *
 * @remarks
 * Prefer using `import` or `require`.
 *
 * @typeParam O - The type of the JSON if any.
 * @param path - The path to the JSON file.
 * @returns The JSON.
 */
export function readJSON<O extends JSONLike | any[]>(path: string): O;
/**
 * Reads a JSON through its path.
 *
 * @remarks
 * Prefer using `import` or `require`.
 *
 * @typeParam O - The type of the JSON if any.
 * @param path - The path to the JSON file.
 * @returns The JSON.
 */
export function readJSON<O extends JSONLike | any[]>(path: string): any | O {
	const bufferedData = fs.readFileSync(path);
	return JSON.parse(bufferedData.toString('utf8'));
}
