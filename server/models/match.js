(function(){
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var matchSchema = new Schema({
    id: { type: String },
    Name: { type: String },
    atg_gameroom__External_Id__c: { type: String },
    atg_gameroom__Game__c: { type: String },
    atg_gameroom__Score_Recorded_Date__c: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now },
  });

  module.exports = mongoose.model('Match', matchSchema);

})();
