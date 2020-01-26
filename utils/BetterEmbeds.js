/**
 * Class for creating simplier embeds.
 * @module utils/BetterEmbed
 */
module.exports = class BetterEmbed {
	/**
	 * Create a BetterEmbed.
	 * @param {Object?} props - Props of the embed.
	 */
	constructor(props) {
		if (props.title) this.title = props.title;
		if (props.description) this.description = props.description;
		if (props.author) this.author = props.author;
		if (props.author_icon) this.author_icon = props.author_icon;
		if (props.author_url) this.author_url = props.author_url;
		if (props.image) this.image = props.image;
		if (props.thumbnail) this.thumbnail = props.thumbnail;
		if (props.footer) this.footer = props.footer;
		if (props.footer_icon) this.footer_icon = props.footer_icon;
		if (props.timestamp) this.timestamp = props.timestamp;
		if (props.color) this.color = props.color;
		this.fields = props.fields ? props.fields : [];
	}
	
	
	// Changement des chemins du require pour un chemin relatif
	/**
	 * To convert BetterEmbed to EmbedObjet.
	 * @return {{image: (*), thumbnail: (*), color: (*), footer: (*), author: (*), description: (*), title: (*), fields: ([]), timestamp: (*)}}
	 */
	build() {
		function isTemplate(tester, ...templates) {
			return !tester instanceof Object ? false : templates.includes(tester.keys());
		}
		
		const objects = {
			authorFull: ['name', 'icon_url', 'url'],
			author    : ['name', 'icon_url'],
			image     : ['url'],
			footer    : ['text'],
			footerFull: ['text', 'icon_url']
		};
		
		return {
			title      : this.title ? this.title : undefined,
			description: this.description ? this.description : undefined,
			author     : isTemplate(this.author, objects.author, objects.authorFull) ? this.author : this.author instanceof String ? {
				name    : this.author,
				icon_url: this.author_icon ? this.author_icon : undefined,
				url     : this.author_url ? this.author_url : undefined
			} : undefined,
			image      : isTemplate(this.image, objects.image) ? this.image : this.image instanceof String ? {
				url: this.image
			} : undefined,
			thumbnail  : isTemplate(this.thumbnail, objects.image) ? this.thumbnail : this.thumbnail instanceof String ? {
				url: this.thumbnail
			} : undefined,
			footer     : isTemplate(this.author, objects.footer, objects.footerFull) ? this.footer : this.author instanceof String ? {
				text    : this.footer,
				icon_url: this.footer_icon ? this.footer_icon : undefined
			} : undefined,
			timestamp  : this.timestamp ? this.timestamp : undefined,
			color      : this.color ? this.color : undefined,
			fields     : this.fields ? this.fields : undefined
		};
	}
};