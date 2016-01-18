"use strict";


var pageLoad = require("./lib/promise/pageLoader");
var fileAppender = require("./lib/promise/fileAppender");
var html = require("./lib/htmlAnalyzer");
var co = require("co");

var url = process.argv[2] || "http://www.dn.se";
var path = "./dump.txt";
var title;


co(function*() {

  var data = yield pageLoad.fetch(url);
  console.log("1. fetched page");
  title = html.getTitle(data);
  yield fileAppender.appendFile(path, title + "\n-----------\n");
  console.log("2. Wrote title");
  data = yield pageLoad.fetch("https://www.google.se/search?q=" + title);
  console.log("3. fetch search page");
  var headlines = yield html.getHeadlines(data);
  return fileAppender.appendFile(path, headlines.join("\n") +"\n---\n");
}).then(function() {
  console.log("4. Ready!");
}).catch(function(error) {
  console.log(error);
});


/*
pageLoad.fetch(url).then(function(data) {
    console.log("1. fetched page");
    title = html.getTitle(data);
    return fileAppender.appendFile(path, title + "\n-----------\n");
}).then(function() {
  console.log("2. Wrote title");
  return pageLoad.fetch("https://www.google.se/search?q=" + title);
}).then(function(data) {
  console.log("3. fetch search page");
  var headlines = html.getHeadlines(data);
  return fileAppender.appendFile(path, headlines.join("\n") +"\n---\n");
}).then(function() {
  console.log("4. Ready!");
}).catch(function(error) {
  console.log(error);
});
*/





/*, function(error, data) {
  if(error) {
    return console.log("we got an error: ", error.message);
  }
  var title = html.getTitle(data);
  console.log("The title is: " + title);
  // save the title to a file
  fs.appendFile("./dump.txt", title +"\n---------\n", function(error) {
    if(error) {
      return console.log("error writing file");
    }
    pageLoad.fetch("https://www.google.se/search?q=" + title, function(error, data) {
      if(error) {
        return console.log("we got an error: ", error.message);
      }
      var headlines = html.getHeadlines(data);
      fs.appendFile("./dump.txt", headlines.join("\n") +"\n---\n", function(error) {
        if(error) {
          return console.log("error writing file");
        }
        console.log("file written");
      });
    });
  });
});
*/
