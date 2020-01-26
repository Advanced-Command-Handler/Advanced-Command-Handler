/** @module utils/Logger */
module.exports = class Logger {
	static logComments = true;
	static #text = '';
	
	static colors = {
		red    : '#b52825',
		orange : '#e76a1f',
		gold   : '#deae17',
		yellow : '#eeee23',
		green  : '#3ecc2d',
		teal   : '#11cc93',
		blue   : '#2582ff',
		indigo : '#524cd9',
		violet : '#7d31cc',
		magenta: '#b154cf',
		pink   : '#d070a0',
		brown  : '#502f1e',
		black  : '#000000',
		grey   : '#6e6f77',
		white  : '#ffffff',
		default: '#cccccc'
	};
	
	static #types = {
		error  : 'red',
		warn   : 'yellow',
		info   : 'blue',
		log    : 'default',
		test   : 'white',
		comment: 'grey',
		event  : '#43804e'
	};
	
	/**
	 * Log a test.
	 * @param {Object|String} message - Object or String to log.
	 * @param {String?} type - The type (before the message) to show.
	 * @param {String?} color - Color for the message
	 * @return {void}
	 */
	static log(message, type = 'log', color = 'log') {
		this.process(message, color, type);
	}
	
	/**
	 * Log an error.
	 * @param {Object|String} message - Object or String to log.
	 * @param {String} typeToShow - The type (before the message) to show.
	 * @return {void}
	 */
	static error(message, typeToShow = 'error') {
		this.process(message, 'error', typeToShow);
	}
	
	/**
	 * Log a warn.
	 * @param {Object|String} message - Object or String to log.
	 * @param {String} typeToShow - The type (before the message) to show.
	 * @return {void}
	 */
	static warn(message, typeToShow = 'warn') {
		this.process(message, 'warn', type);
	}
	
	/**
	 * Log an info.
	 * @param {Object|String} message - Object or String to log.
	 * @param {String} typeToShow - The type (before the message) to show.
	 * @return {void}
	 */
	static info(message, typeToShow = 'info') {
		this.process(message, 'info', typeToShow);
	}
	
	/**
	 * Log a test.
	 * @param {Object|String} message - Object or String to log.
	 * @param {String} typeToShow - The type (before the message) to show.
	 * @return {void}
	 */
	static test(message, typeToShow = 'test') {
		this.process(message, 'test', typeToShow);
	}
	
	/**
	 * Log a comment (if comments are activated).
	 * @param {Object|String} message - Object or String to log.
	 * @param {String} typeToShow - The type (before the message) to show.
	 * @return {void}
	 */
	static comment(message, typeToShow = 'comment') {
		if (this.logComments) {
			this.process(message, 'comment', typeToShow);
		}
	}
	
	/**
	 * Log an event result.
	 * @param {Object|String} message - Object or String to log.
	 * @param {String} typeToShow - The type (before the message) to show.
	 * @return {void}
	 */
	static event(message, typeToShow = 'event') {
		this.process(message, 'event', typeToShow);
	}
	
	static process(text, type = 'test', message = type) {
		text = `[${message.toUpperCase()}] ${text.toString()}`;
		
		text = text.replace(/(?<![;\d])\d+(\.\d+)?(?!;|\d)/g, match => {
			if (text.indexOf(';224;238;38m') !== -1 && text.indexOf(';224;238;38m') < text.indexOf(match)) {
				return match;
			} else {
				return this.setColor('yellow') + match + this.setColor(type);
			}
		});
		if ((type = this.#types[type])) text = this.setColor(type) + text + this.setColor();
		console.log(text);
	}
	
	/**
	 * Set the actual color (and each characters after).
	 * @param {String|HexColor} color - The color in the static 'colors' list or a type of log.
	 * @param {String} text
	 * @return {string}
	 */
	static setColor(color = 'default', text = '') {
		let result = '\x1b[38;2;';
		if (color = this.colors[this.#types[color]] || this.colors[color] || color && color.match(/#[\d|a-f]{6}/i)[0]) {
			color = color.substring(1, 7).match(/.{2}/g).map(n => parseInt(n, 16)).join(';');
		} else {
			throw new Error('Waiting for a log type, color or HexColor but receive something else.');
		}
		result += color + 'm';
		if(text) {
			console.log(this.#text);
			result += text + this.#text.substring(0, this.#text.indexOf('m') + 1);
		}
		return result;
	}
};