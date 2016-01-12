"use strict";

var fs = require("fs");

module.exports = {
  appendFile: appendFile
};

function appendFile(path, text) {
  return new Promise(function(resolve, reject) {
    fs.appendFile(path, text, function(error) {
      if(error) {
        return reject(new Error("Error appending to file"));
      }
      resolve();
    });
  });
}
