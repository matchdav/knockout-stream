function vm() {
	this.obs = ko.observable('my name is bunnicula');
	this.obsArray = ko.observableArray(['angry','rabbit','has','diabetes']);
}

var model = new vm();

ko.applyBindings(model,document.querySelector("#testform"));