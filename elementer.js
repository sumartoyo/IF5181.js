var Elementer = {
	get: function (id) {
		return document.getElementById(id);
	},
	create: function (tag, id) {
		var el = document.createElement(tag);
		if (typeof id != 'undefined') {
			el.setAttribute('id', id);
		}
		return el;
	},
	remove: function (id) {
		var el = document.getElementById(id);
		if (el != null) {
			el.parentNode.removeChild(el);
		}
	},
}