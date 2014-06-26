var through = require('through');
(require('knockout-stream')(ko));

var obsChannel = model.obs.toStream();
var output = document.querySelector('#output');

var obsArrayChannel = model.obsArray.toStream();

var caps = through(function write(data){
	output.innerHTML = data.toUpperCase();
	this.queue(data);
});

var pushCaps = through(function write(data){
	console.log('got',data);
	this.queue(data);
});

obsChannel.pipe(caps);

obsArrayChannel.pipe(pushCaps);

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
		model.obs('hi');
		output.innerHTML.should.be.ok;
	});

	it('should emit data events',function(done){
		obsChannel.on('data',function(){
			done();
		});
		model.obs('I am done');
	});

	it('the stream should be transformable',function(){
		model.obs('hello');
		output.innerHTML.should.eql('HELLO');
	});
	it('should be writable',function(){
		var str = through(function write(data){
			this.queue(data + ' - no, srsly');
		});
		str.pipe(obsChannel)
		str.write('my name is rabbit food');
		(model.obs()).should.equal('my name is rabbit food - no, srsly');
	})
});

describe('observable array stream',function(){
	it('should listen to array changes',function(done){
		var count = 0;
		obsArrayChannel.on('data',function(){
			count ++;
			if(count > 1) done();
		});
		model.obsArray.push('carrots are for vegans');
		model.obsArray.push('rabbits are for being gnawed by');
	});

	it('should also be writable',function(done){

		var arr = through();
		

		//the change event only fires on writes to an observable
		obsArrayChannel.on('change',function(){
			done();
		});

		arr.pipe(obsArrayChannel);
		arr.write(['my dog is secretly a rabbit']);
		model.obsArray().length.should.equal(1);
	});
});