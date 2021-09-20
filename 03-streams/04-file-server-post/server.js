const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if(pathname.includes('/')){
    res.statusCode = 400;
    res.end('nested path are not allowed');
    return;
  }

  switch (req.method) {
    case 'POST':
      const writer = fs.createWriteStream(filepath, {flags: 'wx'});
      const limiter = new LimitSizeStream({limit: 1e6});

      req
      .on('aborted', () => {
        writer.destroy();
        limiter.destroy();
        fs.unlink(filepath, _ => {});
      })
      .pipe(limiter)
      .on('error', error => {
          if(error.code === 'LIMIT_EXCEEDED'){
            res.statusCode = 413;
            res.end('file is big');
          } else {
            res.statusCode = 500;
            res.end('internal error');
          }

          writer.destroy();
          fs.unlink(filepath, _ => {});
      })
      .pipe(writer)
      .on('error', error => {
          if(error.code === 'EEXIST'){
            res.statusCode = 409;
            res.end('file already exist');
          } else {
            res.statusCode = 500;
            res.end('internal error');
          }
      })
      .on('finish', () => {
          res.statusCode = 201;
          res.end('file written successfully');
      });
    break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
