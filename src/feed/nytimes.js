'use strict';

var unirest     = require('unirest');
var Promise     = require('bluebird');
var prettyDate  = require('../utils/prettyDate.js');
var _           = require('underscore');
const dateformat= require('dateformat');



function queryNewswireAPI() {
  return new Promise(function(resolve, reject) {
    return _queryNewswireAPI(48)
    .then(results => resolve(results));
  });
}

function queryArticlesAPI() {
  let date, finalResult;

  date        = new Date();
  date        = date.setDate(date.getDate() - 7);
  finalResult = [];

  return new Promise(function(resolve, reject) {
    return _queryArticlesAPI(0, date)
    .then(results => {
      finalResult = finalResult.concat(results);
      return _queryArticlesAPI(1, date);
    })
    .then(results => {
      finalResult = finalResult.concat(results);
      return _queryArticlesAPI(2, date);
    })
    .then(results => {
      finalResult = finalResult.concat(results);
      resolve(finalResult);
    })
  });
}

/**
 *
 * @returns {*}
 */
function getNYTimesData() {
  return Promise.all([
    queryNewswireAPI(),
    queryArticlesAPI()
  ]).spread((data1, data2) => {
    return data1.concat(data2);
  });
}


function _queryNewswireAPI(hoursAgo) {
  var data, url, finalResult = [], tmpDate;

  tmpDate = new Date();
  tmpDate = tmpDate.setDate(tmpDate.getDate() - 7);
  url = 'http://api.nytimes.com/svc/news/v3/content/all/' +
        'health/'+hoursAgo+'.json?api-key=9200ed51051ad23b20f2de81661697bf:15:69251599';

  return new Promise(function(resolve, reject) {
    unirest.get(url)
    .end(function (result) {
      if(result.body.results) {
        result.body.results.map(post => {
          data = {};
          data.value  = 2;
          data.name   = post.title;
          data.color  = '#57068c';
          data.date   = prettyDate(post.pub_date);
          data.source = 'The New York Times';
          data.relationships = [];
          data.size   = 0;
          data.url    = post.url;
          if(new Date(data.date) >= tmpDate) finalResult.push(data);
        });
      }
      resolve(finalResult)
    });
  })
}

function _queryArticlesAPI(page, date) {
  var data, dateString, url, finalResult = [];

  dateString= dateformat(date, 'yyyymmdd');

  url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?" +
        "q=disease+health+hospital&begin_date=" + dateString + "&" +
        "sort=newest&page=" + page + "&api-key=3f12aed4815efce42df1847fa57bddae:4:69251599";

  if(page === 0) {
    url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?" +
          "q=disease+health+hospital&begin_date=" + dateString + "&" +
          "sort=newest&api-key=3f12aed4815efce42df1847fa57bddae:4:69251599";
  }

  return new Promise(function(resolve, reject) {
    unirest.get(url)
    .end(function (result) {
      if(result.body.response) {
        result.body.response.docs.map(post => {
          data = {};
          data.name   = post.headline.main;
          data.color  = '#57068c';
          data.date   = prettyDate(post.pub_date);
          data.source = 'The New York Times';
          data.relationships = [];
          data.size   = 40;
          data.url    = post.web_url;

          if(data.date >= new Date().getDate() - 4)
          {
            finalResult.push(data);
          }
        });
      }
      resolve(finalResult)
    });
  })
}

module.exports = {
  query: getNYTimesData
};
