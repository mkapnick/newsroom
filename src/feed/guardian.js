var unirest   = require('unirest');
var Promise   = require('bluebird');

function getGuardianData() {
  var finalResult = [], data;

  return new Promise(function(resolve, reject) {
    unirest.get("http://content.guardianapis.com/search?from-date=2016-01-29" +
                "&q=health%20disease%20hospital&order-by=newest&" +
                "api-key=e74f1877-1629-452e-9e2d-d00002792c64")
    .end(function (result) {
      result.body.response.results.map(post => {
        data = {};
        data.value  = 2;
        data.name   = post.webTitle;
        data.color = .8;
        finalResult.push(data);
      });
      resolve(finalResult);
    });
  });
}

module.exports = {
  query: getGuardianData
};
