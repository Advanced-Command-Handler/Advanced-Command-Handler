/** @module utils/Logger */

const {DateTime} = require('luxon');
/**
 * Log system to customize your logs and make them more informative.
 */
module.exports = class Logger {
	static logComments = true;
	
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
		event  : '#43804e',
		log    : 'default',
		test   : 'white',
		comment: 'grey'
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
		this.process(message, 'warn', typeToShow);
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
		text = text.replace(/(?<![;\d])\d+(\.\d+)?(?!;|\d)/g, match => {
			if (text.indexOf(';224;238;38m') !== -1 && text.indexOf(';224;238;38m') < text.indexOf(match)) {
				return match;
			} else {
				return this.setColor('yellow') + match + this.setColor(type);
			}
		});
		text = text.replace(/\x2b+/gi, this.setColor(type));
		type = this.#types[type] ? this.#types[type] : type;
		text = `${this.setColor('#847270')}[${DateTime.local().toFormat('D HH:mm:ss.u')}]${this.setColor(type)}[${message.toUpperCase()}] ${text.toString() + this.setColor()}`;
		console.log(text);
	}
	
	/**
	 * Set the actual color (and each characters after).
	 * @param {String|HexColor} color - The color in the static 'colors' list or a type of log.
	 * @param {String} text - For only coloring the text.
	 * @param {String} colorAfter - For set the color after the text.
	 * @return {string}
	 */
	static setColor(color = 'default', text = '', colorAfter = '') {
		if (color = this.colors[this.#types[color]] || this.colors[color] ||  this.#types[color] && this.#types[color].match(/#[0-9|a-f]{6}/i)[0] || color && color.match(/#[0-9|a-f]{6}/i)[0]) {
			color = '\x1b[38;2;' + color.substring(1, 7).match(/.{2}/g).map(n => parseInt(n, 16)).join(';') + 'm';
		} else {
			throw new Error('Waiting for a log type, color or HexColor but receive something else.');
		}
		if(colorAfter) {
			if (colorAfter = this.colors[this.#types[colorAfter]]
				|| this.colors[colorAfter]
				|| this.#types[colorAfter]
				&& this.#types[colorAfter].match(/#[0-9|a-f]{6}/i)[0]
				|| colorAfter.match(/#[0-9|a-f]{6}/i)[0]) {
				colorAfter = '\x1b[38;2;' + colorAfter.substring(1, 7).match(/.{2}/g).map(n => parseInt(n, 16)).join(';') + 'm';
			} else {
				throw new Error('Waiting for a log type, color or HexColor but receive something else.');
			}
		}
		return text ? color + text + (colorAfter ? colorAfter : '\x2b') : color;
	}
};