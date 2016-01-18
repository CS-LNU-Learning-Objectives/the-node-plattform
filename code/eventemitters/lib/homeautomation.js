"use strict";

var EventEmitter = require("events").EventEmitter;

var util = require("util");

function HomeAutomation() {
  EventEmitter.call(this);
}
util.inherits(HomeAutomation, EventEmitter);

HomeAutomation.prototype.bulbOn = function(bulbName) {
  var result = {
    deviceName: bulbName,
    state: "on"
  };
  this.emit("changeState",  result);
};

HomeAutomation.prototype.bulbOff = function(bulbName) {
  var result = {
    deviceName: bulbName,
    state: "off"
  };
  this.emit("changeState",  result);
};

HomeAutomation.prototype.setMode = function(mode) {
  switch(mode) {
    case "away":
      this.bulbOff("hall");
      this.bulbOff("living room");
      break;
    case "home":
      this.bulbOn("hall");
      this.bulbOn("living room");
      break;
    default:
      this.emit("error", new Error("no known mode"));
  }
};

module.exports = HomeAutomation;
