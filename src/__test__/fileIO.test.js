'use strict';

const fio = require('../lib/fileIO');

describe('fileIO module tests', () => {
  test('Read test file and check returned data', () => {
    const mockData = 'THIS IS TEST FILE DATA\nTWO WHOLE LINES!';
    const fd = `${__dirname}/assets/testdata.txt`;
    fio.getHtmlFile(fd)
      .then((data) => {
        expect(data).toEqual(mockData);
      })
      .catch(err => console.log('unexpected file read error', err));
  });

  test('Test bad filename response', () => {
    const fd = `${__dirname}/assets/testdata.NOT`;
    fio.getHtmlFile(fd)
      .then((data) => {
        console.log('unexpected .then block access on bad fd', data);
      })
      .catch((err) => {
        expect(err).toBeTruthy();
        expect(err.code).toEqual('ENOENT');
      });
  });
});
