(function(){
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var playerSchema = new Schema({
    Name: { type: String },
    atg_gameroom__External_Id__c: { type: String },
    atg_gameroom__Active__c: { type: Boolean },
    atg_gameroom__Email__c: { type: String },
    atg_gameroom__Player_Edit_Token__c: { type: Number },
    atg_gameroom__Screen_Name__c: { type: String },
    atg_gameroom__Player_Created_Date__c: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now },
  });

  module.exports = mongoose.model('PlayerSchema', playerSchema);

})();
