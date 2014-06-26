var through = require('through');

module.exports = function (ko) {

	function toStream() {

		//the observable context
		var _this = this;


		var stream = through(function write (data) {

			//just push it out
			this.queue(data);

			//if the observable different, let it be known
			if(_this()!==data) {
				this.emit('change',data);

				//and also write it.  (duplexing is fun)
				_this(data);
			}

		});
		stream.write(_this());
		_this.subscribe(function feedStream(data) {
			stream.emit('change',data);
			stream.write(data);
		});

		return stream;

	}

	ko.subscribable.fn.toStream = toStream;
};