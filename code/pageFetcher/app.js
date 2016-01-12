"use strict";

var fs = require("fs");
var pageLoad = require("./lib/pageLoader");
var html = require("./lib/htmlAnalyzer");

var url = process.argv[2] || "http://www.dn.se";

pageLoad.fetch(url, function(error, data) {
  if(error) {
    return console.log("we got an error: ", error.message);
  }
  var title = html.getTitle(data);
  console.log("The title is: " + title);
  // save the title to a file
  fs.appendFile("./dumpTitle.txt", title +"\n---------\n", function(error) {
    if(error) {
      return console.log("error writing file");
    }
    pageLoad.fetch("https://www.google.se/search?q=" + title, function(error, data) {
      if(error) {
        return console.log("we got an error: ", error.message);
      }
      var headlines = html.getHeadlines(data);
      fs.appendFile("./dumpHeaders.txt", headlines.join("\n") +"\n---\n", function(error) {
        if(error) {
          return console.log("error writing file");
        }
        console.log("file written");
      });
    });
  });
});
