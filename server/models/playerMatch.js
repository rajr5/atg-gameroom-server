(function(){
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var playerMatchSchema = new Schema({
    Name: { type: String },
    atg_gameroom__External_Id__c: { type: String },
    atg_gameroom__Game__c: { type: String },
    atg_gameroom__Handicap__c: { type: Number },
    atg_gameroom__Lost_Match__c: { type: Boolean },
    atg_gameroom__Won_Match__c: { type: Boolean },
    atg_gameroom__Match__c: { type: String },
    atg_gameroom__Player__c: { type: String },
    atg_gameroom__Points_Scored__c: { type: Number },
    atg_gameroom__Score_Recorded_Date__c: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now },
  });

  module.exports = mongoose.model('PlayerMatch', playerMatchSchema);

})();
