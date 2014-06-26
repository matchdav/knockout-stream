var through = require('through');

module.exports = function (ko) {

	function toStream() {

		//the observable context
		var _this = this;


		var stream = through(function write (data) {

			//just push it out
			this.queue(data);

			//if the observable is being written to from the stream, emit a change event.
			if(_this()!==data) {

				this.emit('change',data);

				//and also write it.  (duplexing is fun)
				_this(data);
			}

		});

		stream.write(_this());

		_this.subscribe(function feedStream(data) {
			stream.write(data);
		});

		return stream;

	}

	ko.subscribable.fn.toStream = toStream;
};