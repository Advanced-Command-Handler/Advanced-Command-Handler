module.exports = class BetterEmbed {
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
	
	build() {
		return {
			title      : this.title ? this.title : undefined,
			description: this.description ? this.description : undefined,
			author     : this.author instanceof Object ? this.author : this.author instanceof String ? {
				name    : this.author,
				icon_url: this.author_icon ? this.author_icon : undefined,
				url     : this.author_url ? this.author_url : undefined
			} : undefined,
			image      : this.image instanceof Object ? this.image : this.image instanceof String ? {
				url: this.image
			} : undefined,
			thumbnail  : this.thumbnail instanceof Object ? this.thumbnail : this.thumbnail instanceof String ? {
				url: this.thumbnail
			} : undefined,
			footer     : this.footer instanceof Object ? this.footer : this.author instanceof String ? {
				text    : this.footer,
				icon_url: this.footer_icon ? this.footer_icon : undefined
			} : undefined,
			timestamp  : this.timestamp ? this.timestamp : undefined,
			color      : this.color ? this.color : undefined,
			fields     : this.fields ? this.fields : undefined
		};
	}
};