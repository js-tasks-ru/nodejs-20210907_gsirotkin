const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.on('error', err => console.log(err.message));
  }

  writeSize = 0;

  _transform(chunk, encoding, callback) {
    this.writeSize += chunk.length;
    
    if(this.writeSize > this.limit) {
        callback(new LimitExceededError());
    } else { 
        callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;