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
		this.title = props ? props.title : '';
		this.description = props ? props.description : '';
		this.author = props ? props.author : '';
		this.author_icon = props ? props.author_icon : '';
		this.author_url = props ? props.author_url : '';
		this.image = props ? props.image : '';
		this.thumbnail = props ? props.thumbnail : '';
		this.footer = props ? props.footer : '';
		this.footer_icon = props ? props.footer_icon : '';
		this.timestamp = props ? props.timestamp : '';
		this.color = props ? props.color : '';
		this.fields = props ? props.fields : [];
	}
	
	
	// Changement des chemins du require pour un chemin relatif
	/**
	 * To convert BetterEmbed to EmbedObjet.
	 * @return {{image: (*), thumbnail: (*), color: (*), footer: (*), author: (*), description: (*), title: (*), fields: ([]), timestamp: (*)}}
	 */
	build() {
		/**
		 * Test if tester is a template.
		 * @param {Object} tester - Object to test.
		 * @param {objects}templates - Templates to test.
		 * @return {boolean}
		 */
		function isTemplate(tester, ...templates) {
			return tester.constructor.name === 'Object' ? templates.includes(tester.keys()) : false;
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
