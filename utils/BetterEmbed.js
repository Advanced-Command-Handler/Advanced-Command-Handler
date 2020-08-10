/**
 * Class for creating simplier embeds.
 * @module utils/BetterEmbed
 */
module.exports = class BetterEmbed {
	/**
	 * @typedef {Object} BetterEmbedObject
	 * @property {string} title
	 * @property {string} description
	 * @property {string} author
	 * @property {string} authorIcon
	 * @property {string} authorUrl
	 * @property {string} image
	 * @property {string} thumbnail
	 * @property {string} footer
	 * @property {string} footerIcon
	 * @property {string} timestamp
	 * @property {string} color
	 * @property Array<{name: string, value: string}> fields
	 */
	
	/**
	 * Store your templates here !
	 * @type {Object<BetterEmbedObject>}
	 */
	static templates = {
		basic: {
			footer:     '${client.user.username}',
			footerIcon: '${client.user.displayAvatarURL()}',
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
	 * @param {string} [author]
	 * @param {string} [authorIcon]
	 * @param {string} [authorUrl]
	 * @param {string} [color]
	 * @param {string} [description]
	 * @param {Array<{name: string, value: string}>} [fields]
	 * @param {string | {text: string, icon_url: string}} [footer]
	 * @param {string} [footerIcon]
	 * @param {string} [image]
	 * @param {string} [thumbnail]
	 * @param {string} [timestamp]
	 * @param {string} [title]
	 */
	constructor({author, authorIcon, authorUrl, color, description, fields, footer, footerIcon, image, thumbnail, timestamp, title} = {}) {
		if (title) this.title = title;
		if (description) this.description = description;
		if (author) this.author = author;
		if (authorIcon) this.authorIcon = authorIcon;
		if (authorUrl) this.authorUrl = authorUrl;
		if (image) this.image = image;
		if (thumbnail) this.thumbnail = thumbnail;
		if (footer) this.footer = footer;
		if (footerIcon) this.footerIcon = footerIcon;
		if (timestamp) this.timestamp = timestamp;
		if (color) this.color = color;
		if (fields) this.fields = fields;
	}
	
	/**
	 * Generates a BetterEmbed from a template, replacing the values if you include any.
	 * @param {BetterEmbedObject | string} template - A template or a template name.
	 * @param {Object} [values] - The values in an object if any in the template.
	 * @return {BetterEmbed} - The resulting BetterEmbed.
	 * @example
	 * const embed = BetterEmbed.fromTemplate('basic', {client: message.client});
	 * message.channel.send({embed: embed.build()});
	 */
	static fromTemplate(template, values = {}) {
		if (typeof template === 'string') template = BetterEmbed.templates[template] || {};
		
		const betterEmbed = new BetterEmbed();
		for (const prop in template) {
			const code = template[prop].replace(/\${(.+?)}/g, (str, value) => values.hasOwnProperty(value.split('.')[0]) ? `values.${value}` : value);
			template[prop] = eval(`${code}`);
			betterEmbed[prop] = template[prop];
		}
		
		return betterEmbed;
	}
	
	/**
	 * To convert BetterEmbed to EmbedObjet.
	 * @returns {{image: {url: string}, thumbnail: {url: string}, color: string, footer: {icon_url: string, text: string}, author: {icon_url: string, name: string, url: string}, description: string, title: string, fields: Array<{name: string, value: string}>, timestamp: string}}
	 */
	build() {
		return {
			title:       this.title,
			description: this.description,
			author:      {
				name:     this.author,
				icon_url: this.authorIcon,
				url:      this.authorUrl,
			},
			image:       {
				url: this.image,
			},
			thumbnail:   {
				url: this.thumbnail,
			},
			footer:      {
				text:     this.footer,
				icon_url: this.footerIcon,
			},
			timestamp:   this.timestamp,
			color:       this.color,
			fields:      this.fields,
		};
	}
};


