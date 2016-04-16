(function(){
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var featureRequestSchema = new Schema({
    id: { type: String },
    Name: { type: String },
    atg_gameroom__External_Id__c: { type: String },
    atg_gameroom__Feature_Description__c: { type: String },
    atg_gameroom__Feature_Name__c: { type: String },
    atg_gameroom__Player_Requested__c: { type: String },
    atg_gameroom__Status__c: { type: String },
    atg_gameroom__Last_Status_Change_Date__c: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now },
  });

  module.exports = mongoose.model('FeatureRequest', featureRequestSchema);

})();
