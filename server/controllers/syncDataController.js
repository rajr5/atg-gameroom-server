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
  function sendJson(res, status, content, keyName) {
    content = content || {};
    if (keyName) {
      var temp = {};

      temp[keyName] = content;
      content = temp;
    }
        res.status(status);
        res.json(content);
  }

  function getRecAndGenId(req) {
    var record = req.body || {};
    return dataHelper.genIdIfNotExist(record);
  }

  // could just generate ID here instead of using helper

  /** Controllers */

  module.exports.getPlayer = function(req, res) {
    // get all players, if ID is specified, then I guess get one player???
    Player.find({}, function(err, players) {
      if (err) {
        sendJson(res, 400, {message: "Error fetching records", error: err});
      } else {
        sendJson(res, 201, players, 'players');
      }
    });
  };

  module.exports.postPlayer = function(req, res) {
    // gen ext id if not exists
    // check ext id exists already
    // update if so, create if no
    var record = getRecAndGenId(req);

    dataHelper.createOrUpdateRecord(record, 'player', function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error creating or updating record", error: err});
      } else {
        sendJson(res, 201, recordOutput, 'player');
      }
    });

  };

  module.exports.getPlayerMatch = function(req, res) {
    // get all players, if ID is specified, then I guess get one player???
    var players = getRecAndGenId(req);
    PlayerMatch.find({}, function(err, playerMatch) {
      if (err) {
        sendJson(res, 400, {message: "Error fetching records", error: err});
      } else {
        sendJson(res, 201, playerMatch);
      }
    });

  };

  module.exports.postPlayerMatch = function(req, res) {
    var record = getRecAndGenId(req);

    dataHelper.createOrUpdateRecord(record, 'playerMatch', function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error creating or updating record", error: err});
      } else {
        sendJson(res, 201, recordOutput, 'playerMatch');
      }
    });
  };

  module.exports.getMatch = function(req, res) {
    // get all players, if ID is specified, then I guess get one player???
    Match.find({}, function(err, match) {
      if (err) {
        sendJson(res, 400, {message: "Error fetching records", error: err});
      } else {
        sendJson(res, 201, match);
      }
    });

  };

  module.exports.postMatch = function(req, res) {

    var record = getRecAndGenId(req);

    dataHelper.createOrUpdateRecord(record, 'match', function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error creating or updating record", error: err});
      } else {
        sendJson(res, 201, recordOutput, 'match');
      }
    });
  };

  module.exports.getFeatureRequest = function(req, res) {
    // get all players, if ID is specified, then I guess get one player???
    FeatureRequest.find({}, function(err, featureRequest) {
      if (err) {
        sendJson(res, 400, {message: "Error fetching records", error: err});
      } else {
        sendJson(res, 201, featureRequest);
      }
    });

  };

  module.exports.postFeatureRequest = function(req, res) {
    var record = getRecAndGenId(req);

    dataHelper.createOrUpdateRecord(record, 'featureRequest', function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error creating or updating record", error: err});
      } else {
        sendJson(res, 201, recordOutput, 'featureRequest');
      }
    });
  };

  module.exports.getAll = function(req, res) {
    dataHelper.fetchAllRecords(function(err, output) {
      if (err) {
        sendJson(res, 400, {message: "Error fetching records", error: err, records: output});
      } else {
        sendJson(res, 201, output, 'records');
      }
    });
  };

  module.exports.postAll = function(req, res) {
    // post all data... check each record for external id and if non existent, then generate them
  };

})();

