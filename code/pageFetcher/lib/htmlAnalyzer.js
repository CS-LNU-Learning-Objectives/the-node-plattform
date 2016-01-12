"use strict";

var cherrio = require("cheerio");

module.exports = {
  getTitle: getTitle,
  getHeadlines: getHeadlines
};

function getTitle(html) {
  return cherrio.load(html)("title").text().trim();
}

function getHeadlines(html) {
  var $ = cherrio.load(html);
  var headlines = $("#ires h3");
  var arr  = [];
  $(headlines).each(function(i, headline){
    arr.push($(headline).text());
  });
  return arr;
}
