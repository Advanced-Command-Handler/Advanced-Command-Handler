function random<T extends any>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

function getKeyByValue<V extends unknown, O extends {[key: string]: unknown}>(object: O, value: V): keyof O | undefined {
	return Object.keys(object).find(key => object[key] === value);
}

function cutIfTooLong(text: string, maxLength: number, endTextIfTooLong: string = '...'): string {
	return text.length > maxLength ? `${text.substring(0, maxLength - endTextIfTooLong.length)}${endTextIfTooLong}` : text;
}
