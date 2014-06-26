function vm() {
	this.obs = ko.observable('my name is joe');
	this.obsArray = ko.observableArray(['rob','jarrod','kelly']);
}

var model = new vm();

ko.applyBindings(model,document.querySelector("#testform"));