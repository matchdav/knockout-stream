function vm() {
	this.observableObject = ko.observable('my name is bunnicula');
	this.observableCollection = ko.observableArray(['angry','rabbit','has','diabetes']);
	this.observableComputedLength = ko.computed(function(){
		return this.observableCollection().length;
	},this);
}

var model = new vm();

ko.applyBindings(model,document.querySelector("#testform"));