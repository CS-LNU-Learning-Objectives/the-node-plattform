"use strict";

var EventEmitter = require("events").EventEmitter;
var util = require("util");

// constructor
function HomeAutomation() {
  EventEmitter.call(this);
}
util.inherits(HomeAutomation, EventEmitter);
module.exports = HomeAutomation;

/**
 * HomeAutomation.prototype.setMode - Set the bulbs in diffrent states, takes 1 s
 *
 * @param  {String} mode A string id for the state
 */
HomeAutomation.prototype.setMode = function(mode) {
  switch(mode) {
    case "away":
      this.bulbOff("living room");
      this.bulbOff("hall");
      break;
    case "home":
      this.bulbOn("hall");
      this.bulbOn("living room");

      break;
    default:
      this.emit("error", new Error("Non supported mode"));
  }
};

/**
 * HomeAutomation.prototype.bulbOn - switch on bulb
 *
 * @param  {String} bulbName Name of the bulb
 * @return {undefined}
 */
HomeAutomation.prototype.bulbOn = function(bulbName) {
  var result = {
    deviceName: bulbName,
    state: "on"
  };
  setTimeout(function() {
    this.emit("change", result);
  }.bind(this), 1000);
};


/**
 * HomeAutomation.prototype.bulbOff - witch off bulb, takes 1 s
 *
 * @param  {String} bulbName Name of the bulb
 */
HomeAutomation.prototype.bulbOff = function(bulbName) {
  var result = {
    deviceName: bulbName,
    state: "off"
  };
  setTimeout(function() {
      this.emit("change", result);
  }.bind(this), 1000);

};
