var through = require('through');
(require('knockout-stream')(ko));

var observableChannel = model.observableObject.toStream();
var output = document.querySelector('#output');

var observableCollectionChannel = model.observableCollection.toStream();

var caps = through(function write(data){
	output.innerHTML = data.toUpperCase();
	this.queue(data);
});

var rip = Function.prototype.bind.bind(Function.prototype.call);

var uppercase = rip(String.prototype.toUpperCase);

var pushCaps = through(function write(data){
	data = data.map(uppercase);
	this.queue(data);
});

var streamInput = document.getElementById('streamInput');
var inputStream = through();

streamInput.onchange = function() {
	inputStream.write(this.value);
	this.value='';
};

inputStream.pipe(through(function write(str){

	this.queue(uppercase(str));

})).pipe(through(function(data){

	model.observableCollection.push(data);

}));

observableChannel.pipe(caps);

observableCollectionChannel.pipe(pushCaps);

describe('environment',function(){
	it('#require',function(){
		should.exist(require);
	});
	it('#ko',function(){
		should.exist(ko);
	});
	it('#through',function(){
		should.exist(through);
	});
});

describe('observableStream',function(){

	it('should pipe data immediately',function(){
		model.observableObject('hi');
		output.innerHTML.should.be.ok;
	});

	it('should emit data events',function(done){
		observableChannel.on('data',function(){
			done();
		});
		model.observableObject('I am done');
	});

	it('the stream should be transformable',function(){
		model.observableObject('hello');
		output.innerHTML.should.eql('HELLO');
	});
	it('should be writable',function(){
		var str = through(function write(data){
			this.queue(data + ' - no, srsly');
		});
		str.pipe(observableChannel)
		str.write('my name is rabbit food');
		(model.observableObject()).should.equal('my name is rabbit food - no, srsly');
	})
});

describe('observable array stream',function(){
	it('should listen to array changes',function(done){
		var count = 0;
		observableCollectionChannel.on('data',function(){
			count ++;
			if(count > 1) done();
		});
		model.observableCollection.push('carrots are for vegans');
		model.observableCollection.push('rabbits are for being gnawed by');
	});

	it('should also be writable',function(done){

		var arr = through();
		

		//the change event only fires on writes to an observable
		observableCollectionChannel.on('change',function(){
			done();
		});

		arr.pipe(observableCollectionChannel);
		arr.write(['my dog is secretly a rabbit']);
		model.observableCollection().length.should.equal(1);
	});
});