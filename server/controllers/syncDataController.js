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

  /** Controllers */
  //////////////////////////////////////////// PLAYER ////////////////////////////////////////////

  module.exports.getPlayers = function(req, res) {
    Player.find({}, function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error fetching records", error: err});
      } else {
        sendJson(res, 201, recordOutput, 'players');
      }
    });
  };

  module.exports.getPlayer = function(req, res) {
    var record = req.body || {};
    Player.findOne(
      {atg_gameroom__External_Id__c: req.params.externalId},
      function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error fetching record", error: err});
      } else {
        sendJson(res, 201, recordOutput, 'player');
      }
    });
  };

  module.exports.postPlayer = function(req, res) {
    var record = getRecAndGenId(req);
    console.log('input record', record);

    dataHelper.createOrUpdateRecord(record, 'player', function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error creating or updating record", error: err});
      } else {
        sendJson(res, 201, recordOutput, 'player');
      }
    });

  };

////////////////////////////////////// PLAYER MATCHES ////////////////////////////////////////

  module.exports.getPlayerMatches = function(req, res) {
    // get all players, if ID is specified, then I guess get one player???
    var players = getRecAndGenId(req);
    PlayerMatch.find({}, function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error fetching records", error: err});
      } else {
        sendJson(res, 201, recordOutput, 'playerMatches');
      }
    });

  };

  module.exports.getPlayerMatch = function(req, res) {
    var record = req.body || {};
    PlayerMatch.findOne(
      {atg_gameroom__External_Id__c: req.params.externalId},
      function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error fetching record", error: err});
      } else {
        sendJson(res, 201, recordOutput, 'playerMatch');
      }
    });
  };

  module.exports.postPlayerMatch = function(req, res) {
    var record = getRecAndGenId(req);
    console.log('input record', record);

    dataHelper.createOrUpdateRecord(record, 'playerMatch', function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error creating or updating record", error: err});
      } else {
        sendJson(res, 201, recordOutput, 'playerMatch');
      }
    });
  };

/////////////////////////////////////////////// MATCHES ///////////////////////////////////////////////////

  module.exports.getMatches = function(req, res) {
    // get all players, if ID is specified, then I guess get one player???
    Match.find({}, function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error fetching records", error: err});
      } else {
        sendJson(res, 201, recordOutput, 'matches');
      }
    });

  };

  module.exports.getMatch = function(req, res) {
    var record = req.body || {};
    Match.findOne(
      {atg_gameroom__External_Id__c: req.params.externalId},
      function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error fetching record", error: err});
      } else {
        sendJson(res, 201, recordOutput, 'match');
      }
    });
  };

  module.exports.postMatch = function(req, res) {

    var record = getRecAndGenId(req);
    console.log('input record', record);

    dataHelper.createOrUpdateRecord(record, 'match', function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error creating or updating record", error: err});
      } else {
        sendJson(res, 201, recordOutput, 'match');
      }
    });
  };


////////////////////////////////////////// FEATURE REQUESTS /////////////////////////////////////////////

  module.exports.getFeatureRequests = function(req, res) {
    // get all players, if ID is specified, then I guess get one player???
    FeatureRequest.find({}, function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error fetching records", error: err});
      } else {
        sendJson(res, 201, recordOutput, 'featureRequest');
      }
    });

  };

  module.exports.getFeatureRequest = function(req, res) {
    var record = req.body || {};
    FeatureRequest.findOne(
      {atg_gameroom__External_Id__c: req.params.externalId},
      function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error fetching record", error: err});
      } else {
        sendJson(res, 201, recordOutput, 'featureRequest');
      }
    });
  };

  module.exports.postFeatureRequest = function(req, res) {
    var record = getRecAndGenId(req);
    console.log('input record', record);

    dataHelper.createOrUpdateRecord(record, 'featureRequest', function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error creating or updating record", error: err});
      } else {
        sendJson(res, 201, recordOutput, 'featureRequest');
      }
    });
  };

 //////////////////////////////////////// ALL RECORDS //////////////////////////////////////////////////////

  module.exports.getAll = function(req, res) {
    dataHelper.fetchAllRecords(function(err, recordOutput) {
      if (err) {
        sendJson(res, 400, {message: "Error fetching records", error: err, records: recordOutput});
      } else {
        sendJson(res, 201, recordOutput, 'records');
      }
    });
  };

  module.exports.postAll = function(req, res) {
    if (!req.body) {
        sendJson(res, 400, {message: "No data was provided"});
    } else {
      var records = req.body;
      console.log('input records', records);
      dataHelper.createOrUpdateAll(records, function(err, recordOutput) {
        if (err) {
          sendJson(res, 400, {error: err, records: recordOutput});
        } else {
          sendJson(res, 201, recordOutput, 'records');
        }
      });
    }
  };

})();

