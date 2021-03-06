'use strict';

var unirest       = require('unirest');
var Promise       = require('bluebird');
const dateformat  = require('dateformat');
const prettyDate  = require('../utils/prettyDate.js');

function getGuardianData() {
  var finalResult = [], data, date, tmpDate;

  date    = new Date();
  tmpDate = new Date();
  date    = date.setDate(date.getDate() - 7); //weeks data from the guardian
  tmpDate = tmpDate.setDate(tmpDate.getDate() - 7);
  date = dateformat(date, 'yyyy-mm-dd');

  return new Promise(function(resolve, reject) {
    unirest.get("http://content.guardianapis.com/search?from-date=" + date +
                "&q=health%20disease%20hospital&order-by=newest&" +
                "&page-size=200&api-key=e74f1877-1629-452e-9e2d-d00002792c64")
    .end(function (result) {
      result.body.response.results.map(post => {
        data = {};
        data.name   = post.webTitle;
        data.color  = '#57068c';
        data.date   = prettyDate(post.webPublicationDate);
        data.source = 'The Guardian';
        data.relationships = [];
        data.size = 40;
        data.url    = post.webUrl;

        if(new Date(data.date) >= tmpDate) finalResult.push(data);
      });
      resolve(finalResult);
    });
  });
}

module.exports = {
  query: getGuardianData
};
