const {DateTime} = require('luxon');

module.exports = class Logger {
	static logComments = true;
	static colors = {
		red: '#b52825',
		orange: '#e76a1f',
		gold: '#deae17',
		yellow: '#eeee23',
		green: '#3ecc2d',
		teal: '#11cc93',
		blue: '#2582ff',
		indigo: '#524cd9',
		violet: '#7d31cc',
		magenta: '#b154cf',
		pink: '#d070a0',
		brown: '#502f1e',
		black: '#000000',
		grey: '#6e6f77',
		white: '#ffffff',
		default: '#cccccc',
	};

	static #types = {
		error: 'red',
		warn: 'yellow',
		info: 'blue',
		event: '#43804e',
		log: 'default',
		test: 'white',
		comment: 'grey',
	};

	/**
	 * Log a comment (if comments are activated).
	 * @param {object | string} message - Object or String to log.
	 * @param {string} typeToShow - The type (before the message) to show.
	 * @returns {void}
	 */
	static comment(message, typeToShow = 'comment') {
		if (Logger.logComments) {
			Logger.process(message, 'comment', typeToShow);
		}
	}

	/**
	 * Log an error.
	 * @param {object | string} message - Object or String to log.
	 * @param {string} typeToShow - The type (before the message) to show.
	 * @returns {void}
	 */
	static error(message, typeToShow = 'error') {
		Logger.process(message, 'error', typeToShow);
	}

	/**
	 * Log an event result.
	 * @param {object | string} message - Object or String to log.
	 * @param {string} typeToShow - The type (before the message) to show.
	 * @returns {void}
	 */
	static event(message, typeToShow = 'event') {
		Logger.process(message, 'event', typeToShow);
	}

	/**
	 * Log an info.
	 * @param {object | string} message - Object or String to log.
	 * @param {string} typeToShow - The type (before the message) to show.
	 * @returns {void}
	 */
	static info(message, typeToShow = 'info') {
		Logger.process(message, 'info', typeToShow);
	}

	/**
	 * Log a message.
	 * @param {object | string} message - Object or String to log.
	 * @param {string?} type - The type (before the message) to show.
	 * @param {string?} color - Color for the message
	 * @returns {void}
	 */
	static log(message, type = 'log', color = 'log') {
		Logger.process(message, color, type);
	}

	/**
	 * Process a log method from the Logger class, you don't have to use it likely.
	 * @param {string} text - Text to log.
	 * @param {string} type - Type of log.
	 * @param {string} message - Message of the log.
	 * @returns {void}
	 */
	static process(text, type = 'test', message = type) {
		const numberColorReplacer = match => {
			return text.indexOf(';224;238;38m') !== -1 && text.indexOf(';224;238;38m') < text.indexOf(match) ? match : Logger.setColor('yellow') + match + Logger.setColor(type);
		};
		text = text.toString().replace(/(?<![;\d])\d+(\.\d+)?(?!;|\d)/g, numberColorReplacer);
		text = text.replace(/\x2b+/gi, Logger.setColor(type));
		type = Logger.#types[type] ? Logger.#types[type] : type;
		text = `${Logger.setColor('#847270')}[${DateTime.local().toFormat('D HH:mm:ss.u')}]${Logger.setColor(type)}[${message.toUpperCase()}] ${text + Logger.setColor()}`;
		console.log(text);
	}

	/**
	 * Set the actual color (and each character after).
	 * @param {string} color - The color in the static 'colors' list, or a type of log.
	 * @param {string} text - For only coloring the text.
	 * @param {string} colorAfter - For set the color after the text.
	 * @returns {string} - The text colored.
	 */
	static setColor(color = 'default', text = '', colorAfter = '') {
		if (
			(color =
				Logger.colors[Logger.#types[color]] || Logger.colors[color] || (Logger.#types[color] && Logger.#types[color].match(/#[0-9|a-f]{6}/i)[0]) || (color && color.match(/#[0-9|a-f]{6}/i)[0]))
		) {
			color =
				'\x1b[38;2;' +
				color
					.substring(1, 7)
					.match(/[0-9|a-f]{2}/gi)
					.map(n => Number.parseInt(n, 16))
					.join(';') +
				'm';
		} else {
			throw new Error('Waiting for a log type, color or HexColor but receive something else.');
		}

		if (colorAfter) {
			if (
				(colorAfter =
					Logger.colors[Logger.#types[colorAfter]] ||
					Logger.colors[colorAfter] ||
					(Logger.#types[colorAfter] && Logger.#types[colorAfter].match(/#[0-9|a-f]{6}/i)[0]) ||
					colorAfter.match(/#[0-9|a-f]{6}/i)[0])
			) {
				colorAfter =
					'\x1b[38;2;' +
					colorAfter
						.substring(1, 7)
						.match(/[0-9|a-f]{2}/gi)
						.map(n => Number.parseInt(n, 16))
						.join(';') +
					'm';
			} else {
				throw new Error('Waiting for a log type, color or HexColor but receive something else.');
			}
		}

		return text ? color + text + (colorAfter ? colorAfter : '\x2b') : color;
	}

	/**
	 * Log a test.
	 * @param {object | string} message - Object or String to log.
	 * @param {string} typeToShow - The type (before the message) to show.
	 * @returns {void}
	 */
	static test(message, typeToShow = 'test') {
		Logger.process(message, 'test', typeToShow);
	}

	/**
	 * Log a warn.
	 * @param {object | string} message - Object or String to log.
	 * @param {string} typeToShow - The type (before the message) to show.
	 * @returns {void}
	 */
	static warn(message, typeToShow = 'warn') {
		Logger.process(message, 'warn', typeToShow);
	}
};
