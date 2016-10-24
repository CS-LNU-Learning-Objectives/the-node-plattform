"use strict";

var HomeAutomation = require("./lib/homeautomation");
var ha = new HomeAutomation();

ha.on("error", function(error) {
  console.log("Error: " + error.message);
});

// we do something wrong
//ha.setMode("Bad mode");

ha.on("change", function(state) {
  console.log(state);
});

//ha.setMode("home");
setTimeout(function() {
  ha.setMode("away");
}, 5000);




/*
// we are getting home
var result = ha.setMode("home");
console.log(result);

// after a while (5s) we went away
setTimeout(function() {
  var result = ha.setMode("away");
  console.log(result);
}, 5000);*/
