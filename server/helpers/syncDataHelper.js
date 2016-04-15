(function(){
  'use strict';
  var crypto = require('crypto');

  function genId() {
    return crypto.randomBytes(16).toString('hex');
  }

  module.exports.genIdIfNotExist = function(record) {
    if (!record.atg_gameroom__External_Id__c) {
      record.atg_gameroom__External_Id__c = genId();
    }
    return record;
  };



})();
