'use strict';
var webhose     = require('./feed/webhose.js');
var nytimes     = require('./feed/nytimes.js');
var guardian    = require('./feed/guardian.js');
var googleNews  = require('./feed/googleNews.js');
var levenshtein = require('./utils/levenshtein.js');
const _         = require('underscore');
var Promise     = require('bluebird');


/**
 * Returns the levenshtein distance between 2 strings
 *
 * @param article
 * @param otherArticle
 * @private
 */
function _compare(articleName, otherArticleName) {
  return levenshtein.compare()(articleName, otherArticleName);
}

var sourceHandlers = {
  webhose: () => webhose.query(),
  nytimes: () => nytimes.query(),
  guardian: () => guardian.query(),
  all: () => {
    let similarity, currentValue, tmpArticle,
        checkedArray, content = [];

    return Promise.all([
      webhose.query(),
      nytimes.query(),
      guardian.query(),
    ]).spread((webhoseData, nytimesData, guardianData) => {
      return { webhoseData, nytimesData, guardianData };
    })
    .then(data => {

      content       = content.concat(data.webhoseData);
      content       = content.concat(data.nytimesData);
      content       = content.concat(data.guardianData);
      currentValue  = 40; //threshold

      console.log(content.length);
      content.forEach((thisArticle, index) => {
        checkedArray = [];
        content.forEach((otherArticle, otherIndex) => {
          if(thisArticle.name !== otherArticle.name &&
            !_.contains(checkedArray, otherArticle.name)) {
            checkedArray.push(otherArticle.name);
            similarity = _compare(thisArticle.name, otherArticle.name);
            if(similarity < currentValue) {
              tmpArticle            = {};
              tmpArticle.name       = thisArticle.name;
              tmpArticle.similarity = similarity;

              content[index].relationships.push(tmpArticle);
              _.sortBy(content[index].relationships, 'similarity');
              content[index].size = content[index].relationships.length;
              //currentValue = similarity;
            }
          }
        });
        //console.log(content[index]);
      });
      return content;
    })
    .then((_content) => {
      console.log('done');
      console.log('length is: ' + _content.length);
      return _content;
    })
  }
};

function feedData(source) {
  return sourceHandlers.all();
}

function convertRatio(x) {
  return 1 - (x/100);
}

module.exports = {
  getData: feedData
};