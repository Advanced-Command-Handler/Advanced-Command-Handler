/**
 * Class for creating simplier embeds.
 */
module.exports = class BetterEmbed {
	/**
	 * @typedef {object} BetterEmbedObject
	 * @property {string} title - Title text.
	 * @property {string} description - Description.
	 * @property {string} author - Author text.
	 * @property {string} authorIcon - Author Icon.
	 * @property {string} authorUrl - Author redirect URL.
	 * @property {string} image - Image URL.
	 * @property {string} thumbnail - Thumbnail URL.
	 * @property {string} footer - Footer text.
	 * @property {string} footerIcon - Footer Icon.
	 * @property {string | number | Date} [timestamp] - Timestamp.
	 * @property {string | number} color - Color.
	 * @property {Array<{name: string, value: string}>} fields - Fields.
	 */

	/**
	 * Store your templates here !
	 * @type {object<BetterEmbedObject>}
	 */
	static templates = {
		basic: {
			footer: '${client.user.username}',
			footerIcon: '${client.user.displayAvatarURL}',
		},
	};

	title;
	description;
	author;
	authorIcon;
	authorUrl;
	image;
	thumbnail;
	footer;
	footerIcon;
	timestamp;
	color;
	fields;

	/**
	 * @param {BetterEmbedObject} properties - Default properties the BetterEmebd Object will have.
	 */
	constructor(properties = {}) {
		if (properties.title) this.title = properties.title;
		if (properties.description) this.description = properties.description;
		if (properties.author) this.author = properties.author;
		if (properties.authorIcon) this.authorIcon = properties.authorIcon;
		if (properties.authorUrl) this.authorUrl = properties.authorUrl;
		if (properties.image) this.image = properties.image;
		if (properties.thumbnail) this.thumbnail = properties.thumbnail;
		if (properties.footer) this.footer = properties.footer;
		if (properties.footerIcon) this.footerIcon = properties.footerIcon;
		if (properties.timestamp) this.timestamp = properties.timestamp;
		if (properties.color) this.color = properties.color;
		this.fields = properties.fields || [];
	}

	/**
	 * Generates a BetterEmbed from a template, replacing the values if you include any.
	 * @param {BetterEmbedObject | string} template - A template or a template name.
	 * @param {object} [values] - The values in an object if any in the template.
	 * @returns {BetterEmbed} - The resulting BetterEmbed.
	 * @example
	 * const embed = BetterEmbed.fromTemplate('basic', {client: message.client});
	 * message.channel.send({embed: embed.build()});
	 */
	static fromTemplate(template, values = {}) {
		if (typeof template === 'string') template = BetterEmbed.templates[template] || {};

		const betterEmbed = new BetterEmbed();
		for (const prop in template) {
			if (!template.hasOwnProperty(prop)) {
				continue;
			}

			if (!Object.prototype.hasOwnProperty.call(template, prop)) {
				return betterEmbed;
			}

			const code = template[prop].replace(/\${(.+?)}/g, (str, value) => (values.hasOwnProperty(value.split('.')[0]) ? `values.${value}` : value));
			template[prop] = eval(`${code}`);
			betterEmbed[prop] = template[prop];
		}

		return betterEmbed;
	}

	/**
	 * To convert BetterEmbed to EmbedObjet.
	 * @returns {{
	 * author: {icon_url: string, name: string, url: string},
	 * color: string,
	 * description: string,
	 * fields: Array<{name: string, value: string}>,
	 * footer: {icon_url: string, text: string}
	 * image: {url: string},
	 * thumbnail: {url: string},
	 * title: string,
	 * timestamp: string,
	 * }} - Returns an Embed Objet (from discord.js).
	 */
	build() {
		return {
			title: this.title,
			description: this.description,
			author: {
				name: this.author,
				icon_url: this.authorIcon,
				url: this.authorUrl,
			},
			image: {
				url: this.image,
			},
			thumbnail: {
				url: this.thumbnail,
			},
			footer: {
				text: this.footer,
				icon_url: this.footerIcon,
			},
			timestamp: this.timestamp,
			color: this.color,
			fields: this.fields,
		};
	}
};
