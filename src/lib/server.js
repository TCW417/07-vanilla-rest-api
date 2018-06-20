'use strict';

const http = require('http');
const fio = require('./fileIO');
const logger = require('./logger');
const cowsay = require('cowsay');
const faker = require('faker');
const bodyParser = require('./body-parser.js');

const server = module.exports = {};

const app = http.createServer((req, res) => {
  bodyParser(req)
    .then((parsedRequest) => {
      if (parsedRequest.method === 'GET') {
        if (parsedRequest.url.pathname === '/') {
          fio.getHtmlFile(`${__dirname}/index.html`)
            .then((fileBuffer) => {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.write(fileBuffer);
              res.end();
              return undefined;
            })
            .catch((err) => {
              logger.log(logger.ERROR, 'Error reading index.html', err);
              return undefined;
            });
          return undefined;
        }

        if (parsedRequest.url.pathname === '/cowsay') {
          let cowSays = faker.name.findName();
          if (parsedRequest.url.query.text) {
            cowSays = parsedRequest.url.query.text;
          }
          const html = `<!DOCTYPE html>
          <html>
            <head>
              <title> cowsay </title>
            </head>
            <body>
              <h1> Welcome to Cowsay! </h1>
              <pre>
                ${cowsay.say({ text: cowSays })}
              </pre>
            </body>
          </html>`;
          res.writeHead(200, { 'Content-type': 'text/html' });
          res.write(html);
          res.end();
          return undefined;
        }

        if (parsedRequest.url.pathname === '/api/cowsay') {
          if (!parsedRequest.url.query.text || parsedRequest.url.query.text === '') {
            res.writeHead(400, { 'Content-type': 'application/json' });
            res.write(JSON.stringify({ error: 'invalid request: text query required' }));
            res.end();
            return undefined;
          }
          
          const cowSays = cowsay.say({ text: parsedRequest.url.query.text });
          res.writeHead(200, { 'Content-type': 'applicaiton/json' });
          res.write(JSON.stringify({ content: cowSays }));
          res.end();
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
        if (!parsedRequest.body) { // a POST without a body is an error for ever route.
          res.writeHead(400, { 'Content-type': 'application/json' });
          res.write(JSON.stringify({ error: 'invalid request: body required' }));
          res.end();
          return undefined;
        }

        if (parsedRequest.url.pathname === '/api/echo') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(parsedRequest.body));
          res.end();
          return undefined;
        }

        if (parsedRequest.url.pathname === '/api/cowsay') {
          if (!parsedRequest.body.text || parsedRequest.body.text === '') {
            res.writeHead(400, { 'Content-type': 'application/json' });
            res.write(JSON.stringify({ error: 'invalid request: non-empty text property required' }));
            res.end();
            return undefined;
          }
          
          const cowSays = cowsay.say({ text: parsedRequest.body.text });
          res.writeHead(200, { 'Content-type': 'applicaiton/json' });
          res.write(JSON.stringify({ content: cowSays }));
          res.end();
          return undefined;
        }
      }
      // catch all...
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('NOT FOUND');
      res.end();
      return undefined;
    })
    .catch((err) => {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      logger.log(logger.ERROR, `Boddy Parser threw error: ${err}`);
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
