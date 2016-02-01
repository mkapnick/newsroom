'use strict';
var unirest       = require('unirest');
var Promise       = require('bluebird');
var dateformat    = require('dateformat');
var _             = require('underscore');
const prettyDate  = require('../utils/prettyDate.js');

function getGoogleNewsData() {
  var data, finalResult = [];

  return new Promise(function(resolve, reject) {
    unirest.get("https://ajax.googleapis.com/ajax/services/search/news?" +
                "v=1.0&q=health+disease+hospital")
      .end(function (result) {
        result.body = JSON.parse(result.body);
        result.body.responseData.results.map(post => {
          data = {};
          data.value  = 2;
          data.name   = post.titleNoFormatting;
          data.color  = .8;
          data.date   = prettyDate(new Date());
          console.log(data.date);
          finalResult.push(data);
        });
        resolve(finalResult)
      });
  })
}

module.exports = {
  query: getGoogleNewsData
};
