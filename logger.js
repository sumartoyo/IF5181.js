var Logger = {
	id: 'log',
	log: function (message) {
		var el = Elementer.create('p', Logger.id);
		el.textContent = message;
		document.body.appendChild(el);
	},
	clear: function () {
		Elementer.remove(Logger.id);
	},
};