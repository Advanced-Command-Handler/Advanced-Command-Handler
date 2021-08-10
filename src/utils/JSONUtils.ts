import * as fs from 'fs';
import {Logger} from './';

export type JSONLike = {[k: string]: number | string | boolean | JSONLike | JSONLike[]} | JSONLike[];

/**
 * Saves a JSON-Like object into a JSON file.
 *
 * @param path - The path of the JSON file.
 * @param content - The content to save.
 * @returns - True if operation has successfully worked.
 */
export function saveJSON(path: string, content: JSONLike): boolean {
	if (!fs.existsSync(path)) {
		Logger.warn(`Cannot save JSON content to '${path}', file not found.`, 'JSONWriter');
		return false;
	}

	const stringified = JSON.stringify(content, null, '\t');
	if (content.length === 0) {
		Logger.warn(`Cannot save JSON content to '${path}', content is empty.`, 'JSONWriter');
		return false;
	}

	fs.writeFile(path, stringified, err => {
		if (err) Logger.error(`Cannot save JSON content to '${path}', error:\n${err.stack}`, 'JSONWriter');
		return false;
	});

	return true;
}

/**
 * Reads a JSON through its path.
 *
 * @remarks
 * Prefer using `import` or `require`.
 * @param path - The path to the JSON file.
 * @returns - The JSON.
 */
export function readJSON(path: string): JSONLike;
/**
 * Reads a JSON through its path.
 *
 * @remarks
 * Prefer using `import` or `require`.
 * @typeParam O - The type of the JSON if any.
 * @param path - The path to the JSON file.
 * @returns - The JSON.
 */
export function readJSON<O extends JSONLike>(path: string): O {
	const bufferedData = fs.readFileSync(path);
	return JSON.parse(bufferedData.toString('utf8'));
}
