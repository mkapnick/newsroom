'use strict';
var unirest   = require('unirest');
var Promise   = require('bluebird');
var prettyDate= require('../utils/prettyDate.js');

function getWebhoseData() {
  var finalResult = [], data, tmpDate;

  tmpDate = new Date();
  tmpDate = tmpDate.setDate(tmpDate.getDate() - 7);

  return new Promise(function(resolve, reject) {
    unirest.get("https://webhose.io/search?token=cc9ae752-e554-4216-907" +
                "b-96f946adb232&format=json&q=health%20disease%20hospital" +
                "%20physician%20language%3A(english)%20thread.country%3AUS")
    .header("Accept", "text/plain")
    .end(function (result) {
      console.log('got webhose results...');
      result.body.posts.map(post => {
        data = {};
        data.name   = post.thread.title;
        data.color = '#57068c';
        data.date  = prettyDate(post.published);
        data.source = 'Webhose';
        data.relationships = [];
        data.size = 40;
        data.url    = post.url;
        if(new Date(data.date) >= tmpDate) finalResult.push(data);
      });

      resolve(finalResult);
    });
  });
}

module.exports = {
  query: getWebhoseData
};
