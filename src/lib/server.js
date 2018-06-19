'use strict';

const http = require('http');
const fio = require('./fileIO');
const cowsay = require('cowsay');
const bodyParser = require('./body-parser.js');

const server = module.exports = {};

const app = http.createServer((req, res) => {
  bodyParser(req)
    .then((parsedRequest) => {
      console.log('parsedRequst.method:', parsedRequest.method);
      console.log('parsedRequest.pathname:', parsedRequest.url.pathname);
      console.log('parsedRequest.query', parsedRequest.url.query);
      if (parsedRequest.method === 'GET') {
        if (parsedRequest.url.pathname === '/') {
          console.log('>>>>>>> GET / <<<<<<<<');
          fio.getHtmlFile(`${__dirname}/index.html`)
            .then((fileBuffer) => {
              console.log('getHtmlFile .then fileBuffer', fileBuffer);
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.write(fileBuffer);
              res.end();
              return undefined;
            })
            .catch((err) => {
              console.log('Error reading index.html', err);
              return undefined;
            });
          return undefined;
        }

        if (parsedRequest.url.pathname === '/api/time') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify({
            date: new Date(),
          }));
          res.end();
          return undefined;
        }

        // this method demos what happens when you make a GET request such as:
        // http GET :3000/api/cowsayPage?text=hello
        // You can also do: http GET :3000/api/cowasyPage text==hello
        // OR http :3000/api/cowsayPage text==hello because the request verb defaults to "GET"
        if (parsedRequest.url.pathname === '/api/cowsayPage') {
          // HINT for lab: because we need a parsedRequest.url.query.text, 
          // how should we handle if a user doesn't put in a "text" value? 
          res.writeHead(200, { 'Content-Type': 'text/html' });
          const cowsayText = cowsay.say({ 
            text: parsedRequest.url.query.text,
          });
          res.write(`<section><h3><a href="/api/time">Click here for current time</a></h3><pre>${cowsayText}</pre></section>`);
          res.end();
          return undefined;
        }
      }  
      // this method demos what happens when you make a POST 
      // request with arbitrary key/value pair data, i.e.:
      // http POST :3000/api/echo name=judy hometown=seattle
      // where "name" is the key and "judy" is the value
      if (parsedRequest.method === 'POST') {
        if (parsedRequest.url.pathname === '/api/echo') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(parsedRequest.body));
          res.end();
          return undefined;
        }
      }
      // catch all...
      console.log('catch all reached.  NOT FOUND!');
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('NOT FOUND');
      res.end();
      return undefined;
    })
    .catch((err) => {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      console.log(err);
      res.write('BAD REQUEST');
      res.end();
      return undefined;
    });
});


server.start = (port, callback) => {
  return new Promise((resolve, reject) => {
    try {
      app.listen(port, callback);
    } catch (err) {
      return reject(err);
    }
    return resolve();
  });
};

server.stop = (callback) => {
  return new Promise((resolve, reject) => {
    try {
      app.close(callback);
    } catch (err) {
      return reject(err);
    }
    return resolve();
  });
};
