const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.on('end', _ => console.log('end'));
  }

    str = '';
    
  _transform(chunk, encoding, callback) {
    let arr = chunk.toString().split(os.EOL);
    if(arr.length == 1){
      this.str += arr[0];
    } else {
      this.push(this.str + arr[0]);
      for(let i = 1; i < arr.length-1; i++){
          this.push(arr[i]);
      }
      this.str = arr[arr.length-1];
    }
    callback();
  }

  _flush(callback) {
    this.push(this.str);
    callback();
  }
}

module.exports = LineSplitStream;