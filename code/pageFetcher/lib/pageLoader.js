"use strict";
var request = require("request");

module.exports = {
  fetch: fetch
};

function fetch(url, callback) {

  request(url, function (error, response, html) {
    if(error) {
      return callback(error);
    }

    if(response.statusCode !== 200) {
      return callback(new Error("God bad status code from server"));
    }

    callback(null, html);
  });
}
