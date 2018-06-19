'use strict';

const fio = module.exports = {};

const fs = require('fs');

fio.getHtmlFile = (fd) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fd, 'utf8', (err, data) => {
      // console.log('back from read, data = ', data.toString());
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

