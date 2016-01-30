var unirest   = require('unirest');
var Promise   = require('bluebird');
var dateformat= require('dateformat');
var _         = require('underscore');

function getNYTimesData() {
  var finalResult = [];

  return new Promise(function(resolve, reject) {
    return _query(1)
    .then(data => {
      _.extend(finalResult, data);
      return _query(2);
    })
    .then(data => {
      _.extend(finalResult, data);
      return _query(3);
    })
    .then(data => {
      _.extend(finalResult, data);
      return _query(4);
    })
    .then(data => {
      _.extend(finalResult, data);
      return _query(5);
    })
    .then(data => {
      _.extend(finalResult, data);
      return _query(6);
    })
    .then(data => {
      _.extend(finalResult, data);
      return _query(7);
    })
    .then(data => {
      _.extend(finalResult, data);
      return resolve(finalResult);
    })
  });
}

function _query(page) {
  var data, now, dateString, finalResult = [];

  now       = new Date();
  dateString= dateformat(now, 'yyyymmdd');

  return new Promise(function(resolve, reject) {
    unirest.get("http://api.nytimes.com/svc/search/v2/articlesearch.json?" +
    "callback=svc_search_v2_articlesearch&q=disease&health&hospital&begin_date=" + '20160129' + "&" +
    "sort=newest&page=" + page + "&api-key=3f12aed4815efce42df1847fa57bddae%3A4%3A69251599")
    .end(function (result) {
      result.body.response.docs.map(post => {
        data = {};
        data.value  = 2;
        data.name   = post.headline.main;
        data.color = .8;
        finalResult.push(data);
      });
      resolve(finalResult)
    });
  })

}

module.exports = {
  query: getNYTimesData
};
