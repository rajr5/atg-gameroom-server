(function(){
  'use strict';


  var _ = require("lodash");
  var dataHelper = require('../helpers/syncDataHelper');
  var FeatureRequest = require('../models/featureRequest');
  var Match = require('../models/match');
  var Player = require('../models/player');
  var PlayerMatch = require('../models/playerMatch');

  /**
   * 200 - OK success GET
   * 201 - created success POST
   * 203 - created success PUT
   * 204 - no content success DELETE
   * 400 bad request
   * 401 unathorized
   * 403 forbidden
   * 404 not found
   * 405 method not allowed
   */
  /** Helper function to send JSON server response */
  var sendJson = function(res, status, content) {
        // Add default message
        content = content || {};
        if ((status === 200 || status === 201 || status === 203) &&
            !content.hasOwnProperty('message')) {
                content.message = "ok";
        }
        res.status(status);
        res.json(content);
  };

  // could just generate ID here instead of using helper

  /** Controllers */

  module.exports.getPlayer = function(req, res) {
    // get all players, if ID is specified, then I guess get one player???
    Player.find({}, function(err, players) {
      if (err) {
        sendJson(res, 400, {message: "Error fetching records", error: err});
      } else {
        sendJson(res, 201, players);
      }
    });
  };


  module.exports.postPlayer = function(req, res) {
    // gen ext id if not exists
    // check ext id exists already
    // update if so, create if no
    var record = res.body;
    dataHelper(record);
    // check if player exists
    Player.findOne(
      {atg_gameroom__External_Id__c: record.atg_gameroom__External_Id__c},
      function(err, player) {
        if (err) {
          sendJson(res, 400, {message: "Error creating record", error: err});
        } else {
          // create player if not found
          if (!player) {
            // Create player
            player = new Player(record);
            player.save(function(err) {
              if (err) {
                sendJson(res, 400, {message: "Error creating record", error: err});
              } else {
                sendJson(res, 201, player);
              }
            });
          } else {
            // update player
            Player.findOneAndUpdate(
              {atg_gameroom__External_Id__c: record.atg_gameroom__External_Id__c},
              player,function(err) {
                if (err) {
                  sendJson(res, 400, {message: "Error creating record", error: err});
                } else {
                  sendJson(res, 201, player);
                }
              });
          }
        }
    });
  };

  module.exports.getPlayerMatch = function(req, res) {

  };

  module.exports.postPlayerMatch = function(req, res) {

  };

  module.exports.getMatch = function(req, res) {

  };

  module.exports.postMatch = function(req, res) {

  };

  module.exports.getFeatureRequest = function(req, res) {

  };

  module.exports.postFeatureRequest = function(req, res) {

  };

  module.exports.getAll = function(req, res) {
    // use all other helper methods, query and combine all data
  };

  module.exports.postAll = function(req, res) {
    // post all data... check each record for external id and if non existent, then I guess generate them?
  };

})();
