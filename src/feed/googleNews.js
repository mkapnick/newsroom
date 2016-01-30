var unirest   = require('unirest');
var Promise   = require('bluebird');
var dateformat= require('dateformat');
var _         = require('underscore');

function getGoogleNewsData() {
  var finalResult = [];

  return new Promise(function(resolve, reject) {
    unirest.get("https://ajax.googleapis.com/ajax/services/search/news?" +
                "v=1.0&q=health%20hospital%20disease")
      .end(function (result) {
        result.body = JSON.parse(result.body);
        result.body.responseData.results.map(post => {
          data = {};
          data.value  = 2;
          data.name   = post.titleNoFormatting;
          data.color = .8;
          finalResult.push(data);
        });
        resolve(finalResult)
      });
  })
}

module.exports = {
  query: getGoogleNewsData
};
