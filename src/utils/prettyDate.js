'use strict';
const dateformat = require('dateformat');

let prettyDate = (date) => dateformat(date, 'yyyy/mm/dd');

module.exports = prettyDate;