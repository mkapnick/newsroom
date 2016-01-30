var unirest   = require('unirest');
var Promise   = require('bluebird');

function getWebhoseData() {
  var finalResult = [], data;

  return new Promise(function(resolve, reject) {
    unirest.get("https://webhose.io/search?token=cc9ae752-e554-4216-907" +
                "b-96f946adb232&format=json&q=health%20disease%20hospital" +
                "%20physician%20language%3A(english)%20thread.country%3AUS")
    .header("Accept", "text/plain")
    .end(function (result) {
      //console.log(result.status, result.headers, result.body);
      console.log('got webhose data...........');
      result.body.posts.map(post => {
        data = {};
        data.value  = 2;
        data.name   = post.thread.title;
        data.color = .8;
        finalResult.push(data);
      });

      resolve(finalResult);
    });
  });
}

module.exports = {
  query: getWebhoseData
};
