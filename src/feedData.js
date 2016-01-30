'use strict';
var webhose     = require('./feed/webhose.js');
var nytimes     = require('./feed/nytimes.js');
var guardian    = require('./feed/guardian.js');
var googleNews  = require('./feed/googleNews.js');
var levenshtein = require('./utils/levenshtein.js');
var Promise     = require('bluebird');

var sourceHandlers = {
  webhose: () => webhose.query(),
  nytimes: () => nytimes.query(),
  guardian: () => guardian.query(),
  googleNews: () => googleNews.query(),
  all: () => {
    let similarity, currentValue, levenshteinMap, dataArray = [];
    return Promise.all([
      webhose.query(),
      nytimes.query(),
      guardian.query(),
      googleNews.query()
    ]).spread((webhoseData, nytimesData, guardianData, gNewsData) => {
      return { webhoseData, nytimesData, guardianData, gNewsData };
    })
    .then(data => {

      data.webhoseData.forEach((whPost, index) => { //100 results
        levenshteinMap = {name: whPost.name, value: 100, color: '#128fd4'};

        //compare with guardian data set
        data.guardianData.forEach(guardianPost => {
          currentValue  = levenshteinMap.value;
          similarity    = levenshtein.compare()(whPost.name, guardianPost.name);
          if(similarity < currentValue) {
            levenshteinMap.name  = guardianPost.name;
            levenshteinMap.value = similarity;
            levenshteinMap.color = '#146643';
          }
        });

        //compare with google news data
        data.gNewsData.forEach(gNewsPost => {
          currentValue  = levenshteinMap.value;
          similarity    = levenshtein.compare()(whPost.name, gNewsPost.name);
          if(similarity < currentValue) {
            levenshteinMap.name  = gNewsPost.name;
            levenshteinMap.value = similarity;
            levenshteinMap.color = '#93811d';
          }
        });

        //compare with nytimes data set
        data.nytimesData.forEach(nytPost => {
          currentValue  = levenshteinMap.value;
          similarity    = levenshtein.compare()(whPost.name, nytPost.name);
          if(similarity < currentValue) {
            levenshteinMap.name  = nytPost.name;
            levenshteinMap.value = similarity;
            levenshteinMap.color = '#57068c'; //nyu purple
          }
        });

        if(levenshteinMap.value === 100) {
          if(levenshteinMap.name.length > 50) {
            levenshteinMap.name = levenshteinMap.name.substring(0, 50) + '...';
            levenshteinMap.value = 99; //give it some value
          }
        }

        levenshteinMap.value = convertRatio(levenshteinMap.value);

        if(!dataArray.some((l) => l.name === levenshteinMap.name )) {
          //check length of name
          if(levenshteinMap.name.length > 100) {
            levenshteinMap.name = levenshteinMap.name.substring(0, 100) + '...';
          }
          dataArray.push(levenshteinMap);
        }
      });
    })
    .then(() => {
      console.log('finished!!!');
      console.log('length is: ' + dataArray.length);
      console.log(JSON.stringify(dataArray));
      return dataArray;
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