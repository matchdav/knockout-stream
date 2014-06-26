function vm() {
	this.observableObject = ko.observable('my name is bunnicula');
	this.observableCollection = ko.observableArray(['angry','rabbit','has','diabetes']);
}

var model = new vm();

ko.applyBindings(model,document.querySelector("#testform"));