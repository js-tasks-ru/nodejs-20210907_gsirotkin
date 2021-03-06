const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if(pathname.includes('/')){
    res.statusCode = 400;
    res.end('nested path are not allowed');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      fs.unlink(filepath, err => {
        if(!err){
          res.statusCode = 200;
          res.end('file delete');
        } else {
          if(err.code === 'ENOENT'){
            res.statusCode = 404;
            res.end('file not found');
          } else {
            res.statusCode = 500;
            res.end('Internal error');
          }
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
