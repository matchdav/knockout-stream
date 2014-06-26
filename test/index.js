var through = require('through');
(require('knockout-stream')(ko));

var obsChannel = model.obs.toStream();
var output = document.querySelector('#output');

var obsArrayChannel = model.obsArray.toStream();

obsChannel.pipe(through(function write(data){
	output.innerHTML = data.toUpperCase();
}));

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

	});
});