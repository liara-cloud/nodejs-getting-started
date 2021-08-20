const fs = require('fs');

module.exports.listFiles = function (path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if(err) return reject(err);
      return resolve(files);
    });
  });
};