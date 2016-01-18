"use strict";

var HomeAutomation = require("./lib/homeautomation");
var ha = new HomeAutomation();

ha.on("error", function(error) {
  console.log(error);
});

ha.on("changeState", function(changeObject) {
  console.log(changeObject);
});

// -------- Bulb on --------
ha.bulbOn("living room");
ha.bulbOn("hall");

// -------- Bulb off --------
ha.bulbOff("hall");
ha.bulbOff("living room");


// -------- Handling status --------
ha.setMode("home");

ha.setMode("Bad mode");

setTimeout(function() {
  ha.setMode("away");
}, 4000);
