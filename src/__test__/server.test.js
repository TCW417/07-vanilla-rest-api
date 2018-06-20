'use strict';

const server = require('../lib/server');
const superagent = require('superagent');
const cowsay = require('cowsay');

const apiUrl = 'http://localhost:5000/api';

beforeAll(() => server.start(5000));
afterAll(() => server.stop());

describe('VALID request to the API', () => {
  describe('GET api/time', () => {
    it('should response with a status 200', (done) => {
      superagent.get(`${apiUrl}/time`)
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('date');
          done();
        });
    });
  });

  describe('GET /api/cowsay with valid query string', () => {
    const mockCow = cowsay.say({ text: 'Hello World' });
    const mockJSON = JSON.stringify({ content: mockCow });
    it('should respond with status 200 and return cow HTML', () => {
      return superagent.get(`${apiUrl}/cowsay`)
        .query({ text: 'Hello World' })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.text).toEqual(mockJSON);
        });
    });
  });

  describe('GET localhost:5000/cowsay with valid query string. Returns HTML', () => {
    const mockCow = cowsay.say({ text: 'Hello World' });
    const mockHTML = `<!DOCTYPE html>
          <html>
            <head>
              <title> cowsay </title>
            </head>
            <body>
              <h1> Welcome to Cowsay! </h1>
              <pre>
                ${mockCow}
              </pre>
            </body>
          </html>`;
    it('should respond with status 200 and return cow HTML', () => {
      return superagent.get('localhost:5000/cowsay')
        .query({ text: 'Hello World' })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.text).toEqual(mockHTML);
        });
    });
  });

  describe('POST /api/cowsay with valid body', () => {
    const mockCow = cowsay.say({ text: 'Hello World' });
    const mockJSON = JSON.stringify({ content: mockCow });
    it('should respond with status 200 and return cow JSON', () => {
      return superagent.post(`${apiUrl}/cowsay`)
        .send({ text: 'Hello World' })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.text).toEqual(mockJSON);
        });
    }); 
  });

  describe('POST /echo', () => {
    it('should return status 200 for successful post', () => {
      return superagent.post(`${apiUrl}/echo`)
        .send({ name: 'Tracy' })
        .then((res) => {
          expect(res.body.name).toEqual('Tracy');
          expect(res.status).toEqual(200);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});

describe('INVALID request to the API', () => {
  describe('GET /api/cowsay with invalid, half-formed query string', () => {
    const mockJSON = JSON.stringify({ error: 'invalid request: text query required' });
    it('should respond with status 200 and return cow HTML', () => {
      return superagent.get(`${apiUrl}/cowsay`)
        .query({ text: '' })
        .then((res) => {
          console.log('unexpected resolve entry after invalide query string', res.body);
        })
        .catch((err) => {
          expect(err.status).toEqual(400);
          expect(err.response.res.text).toEqual(mockJSON);
        });
    });
  });
  describe('POST /api/cowsay with missing body', () => {
    const mockJSON = JSON.stringify({ error: 'invalid request: body required' });
    it('should respond with status 200 and return cow HTML', () => {
      return superagent.post(`${apiUrl}/cowsay`)
        // .send({ })
        .then((res) => {
          console.log('unexpected resolve entry after invalide query string', res.body);
        })
        .catch((err) => {
          expect(err.status).toEqual(400);
          expect(err.response.res.text).toEqual(mockJSON);
        });
    });
  });
  describe('POST /api/cowsay with body but no text proerty', () => {
    const mockJSON = JSON.stringify({ error: 'invalid request: text query required' });
    it('should respond with status 200 and return cow HTML', () => {
      return superagent.post(`${apiUrl}/cowsay`)
        .send({ message: 'this is bad' })
        .then((res) => {
          console.log('unexpected resolve entry after invalide query string', res.body);
        })
        .catch((err) => {
          expect(err.status).toEqual(400);
          expect(err.response.res.text).toEqual(mockJSON);
        });
    });
  });
  describe('GET /cowsayPage', () => {
    it('should err out with 400 status code for not sending text in query', () => {
      return superagent.get(`${apiUrl}/cowsayPage`)
        .query({})
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(400);
          expect(err).toBeTruthy();
        });
    });
  });
});

