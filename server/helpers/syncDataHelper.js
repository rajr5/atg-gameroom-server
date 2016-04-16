(function(){
  'use strict';
  var crypto = require('crypto');
  var async = require('async');

  var FeatureRequest = require('../models/featureRequest');
  var Match = require('../models/match');
  var Player = require('../models/player');
  var PlayerMatch = require('../models/playerMatch');


  /** Generate id if one does not already exist - PUBLIC */
  function genIdIfNotExist(record) {
    if (!record.atg_gameroom__External_Id__c) {
      record.atg_gameroom__External_Id__c = crypto.randomBytes(16).toString('hex');
    }
    return record;
  }

  /**
   * PUBLIC
   * Create record if one does not already exist.
   * @param  {Object}   record     Object being created or updated
   * @param  {String}   recordType Name of mongoose schema object being added or updated
   * @param  {Function} cb         Callback function(err, record)
   */
  function createOrUpdateRecord(record, recordType, cb) {
    try {
      recordType = recordType.toLowerCase();
      // build object with specific fields based on model
      record = getObjForRecordType(record, recordType);
      console.log('--- Creating or updating record ---');
      console.log('recordType', recordType);
      console.log('record', record);
      if (recordType === 'player') {
        createOrSavePlayer(record, cb);
      } else if (recordType === 'match') {
        createOrSaveMatch(record, cb);
      } else if (recordType === 'playermatch') {
        createOrSavePlayerMatch(record, cb);
      } else if (recordType === 'featurerequest') {
        createOrSaveFeatureRequest(record, cb);
      } else {
        // THROW EXCEPTION, record type not found
        throw "record type ["+recordType+"] not found";
      }
    } catch(err) {
      cb(err, null);
    }
  }

  /** Fetch all records in DB and callback with compiled object - PUBLIC */
  function fetchAllRecords(cb) {
    var output = {};
    // Get players
    fetchPlayers(function(err, players) {
      if (err) {
        cb(err, output);
      } else {
        output.players = players;
        // Get Player MAtches
        fetchPlayerMatches(function(err, playerMatches) {
          if (err) {
            cb(err, output);
          } else {
            output.playerMatches = playerMatches;
            // Get MAtches
            fetchMatches(function(err, matches) {
              if (err) {
                cb(err, output);
              } else {
                output.matches = matches;
                // Get Feature Requests
                fetchFeatureRequests(function(err, featureRequests) {
                  if (err) {
                    cb(err, output);
                  } else {
                    output.featureRequests = featureRequests;
                    cb(null, output);
                  }
                });
              }
            });
          }
        });
      }
    });
  }

    /**
     * Create or update all records of all types
     * @param  {Object}   records Object with keys matching the record type names
     * @param  {Function} cb      Callback function(err, records)
     * @return {callback}           Object of all created records
     */
  function createOrUpdateAll(records, cb) {
    // Loop all records, determine if any of them already exist.
    // For items that do ot exist, we have to insert
    try {
      records = records || {}; // maybe check and return meaningful error if needed
      async.parallel({
        players: function(callback){
          loopCreateObj('player', records.players, callback);
        },
        playerMatches: function(callback){
          loopCreateObj('playerMatch', records.playerMatches, callback);
         },
        matches: function(callback){
          loopCreateObj('match', records.matches, callback);
         },
        featureRequests: function(callback){
          loopCreateObj('featureRequest', records.featureRequests, callback);
         }
      }, function(err, results) {
          cb(err, results);
      });

    } catch(err) {
      cb(err, results);
    }
  }

  /** Get object based on data model instead of trusting record input - PUBLIC */
  function getObjForRecordType(record, recordType) {
    recordType = recordType.toLowerCase();
    var returnRecord = {};
    if (recordType === 'player') {
      returnRecord = {
        id: record.Id,
        Name: record.Name,
        atg_gameroom__External_Id__c: record.atg_gameroom__External_Id__c,
        atg_gameroom__Active__c: record.atg_gameroom__Active__c,
        atg_gameroom__Email__c: record.atg_gameroom__Email__c,
        atg_gameroom__Game__c: record.atg_gameroom__Game__c,
        atg_gameroom__Player_Edit_Token__c: record.atg_gameroom__Player_Edit_Token__c,
        atg_gameroom__Screen_Name__c: record.atg_gameroom__Screen_Name__c,
        atg_gameroom__Player_Created_Date__c: record.atg_gameroom__Player_Created_Date__c
      };
    } else if (recordType === 'match') {
      returnRecord = {
        id: record.Id,
        Name: record.Name,
        atg_gameroom__External_Id__c: record.atg_gameroom__External_Id__c,
        atg_gameroom__Game__c: record.atg_gameroom__Game__c,
        atg_gameroom__Score_Recorded_Date__c: record.atg_gameroom__Score_Recorded_Date__c
      };
    } else if (recordType === 'playermatch') {
      returnRecord = {
        id: record.Id,
        Name: record.Name,
        atg_gameroom__External_Id__c: record.atg_gameroom__External_Id__c,
        atg_gameroom__Handicap__c: record.atg_gameroom__Handicap__c,
        atg_gameroom__Lost_Match__c: record.atg_gameroom__Lost_Match__c,
        atg_gameroom__Won_Match__c: record.atg_gameroom__Won_Match__c,
        atg_gameroom__Match__c: record.atg_gameroom__Match__c,
        atg_gameroom__Player__c: record.atg_gameroom__Player__c,
        atg_gameroom__Points_Scored__c: record.atg_gameroom__Points_Scored__c,
        atg_gameroom__Score_Recorded_Date__c: record.atg_gameroom__Score_Recorded_Date__c
      };
    } else if (recordType === 'featurerequest') {
      returnRecord = {
        id: record.Id,
        Name: record.Name,
        atg_gameroom__External_Id__c: record.atg_gameroom__External_Id__c,
        atg_gameroom__Feature_Description__c: record.atg_gameroom__Feature_Description__c,
        atg_gameroom__Feature_Name__c: record.atg_gameroom__Feature_Name__c,
        atg_gameroom__Player_Requested__c: record.atg_gameroom__Player_Requested__c,
        atg_gameroom__Status__c: record.atg_gameroom__Status__c,
        atg_gameroom__Last_Status_Change_Date__c: record.atg_gameroom__Last_Status_Change_Date__c
      };
    } else {
      // THROW EXCEPTION, record type not found
      throw "record type ["+recordType+"] not found";
    }
    return returnRecord;
  }

///////////////// PRIVATE FUNCTIONS ////////////////////////////


  ////////// Helper to loop asynchronously ///////////////////

  function asyncLoop(iterations, func, callback) {
      var index = 0;
      var done = false;
      var loop = {
          next: function() {
              if (done) { return; }
              if (index < iterations) {
                  index++;
                  func(loop);
              } else {
                  done = true;
                  callback();
              }
          },
          iteration: function() {
              return index - 1;
          },
          break: function() {
              done = true;
              callback();
          }
      };
      loop.next();
      return loop;
  }

  ////// Helper to loop records to create or update multiple records //////////////

  function loopCreateObj(objType, obj, callback) {
    var outputArr = [];
    var errors = [];
    if (obj && Array.isArray(obj)) {
      asyncLoop(obj.length, function(loop){
        var record = obj[loop.iteration()];
        genIdIfNotExist(record);
        createOrUpdateRecord(record, objType, function(err, recordOutput) {
          if (err) {
            errors.push({error: err, object: objType});
          } else {
            outputArr.push(recordOutput);
          }
          loop.next();
        });
      }, function() {
        if (errors.length === 0) {
          errors = null;
        }
        callback(errors, outputArr);
      });
        // object was not included as input
    } else {
      console.log('type not found on object');
      callback('type not found on object', outputArr);
    }
  }


  ///////////// DATABASE FUNCTIONS - PRIVATE //////////////////////////////

  /** Create or update database record */
  function createOrSavePlayer(record, cb) {
    Player.findOne(
      {atg_gameroom__External_Id__c: record.atg_gameroom__External_Id__c},
      function(err, player) {
        if (err) {
          cb("Could not retreive record", null);
        } else {
          // create player if not found
          if (!player) {
            // Create player
            var newPlayer = new Player(record);
            newPlayer.save(function(err) {
              if (err) {
                cb("Could not create record", null);
              } else {
                cb(null, newPlayer);
              }
            });

          } else {
            // update player
            Player.findOneAndUpdate(
              {atg_gameroom__External_Id__c: record.atg_gameroom__External_Id__c},
              record,function(err) {
                if (err) {
                  cb("Could not update record", null);
                } else {
                  cb(null, record);
                }
              });
          }
        }
    });
  }

  /** Create or update database record */
  function createOrSavePlayerMatch(record, cb) {
    PlayerMatch.findOne(
      {atg_gameroom__External_Id__c: record.atg_gameroom__External_Id__c},
      function(err, playerMatch) {
        if (err) {
          cb("Could not retreive record", null);
        } else {
          // create playerMatch if not found
          if (!playerMatch) {
            // Create playerMatch
            var newPlayerMatch = new PlayerMatch(record);

            newPlayerMatch.save(function(err) {
              if (err) {
                cb("Could not create record", null);
              } else {
                cb(null, newPlayerMatch);
              }
            });

          } else {
            // update playerMatch
            PlayerMatch.findOneAndUpdate(
              {atg_gameroom__External_Id__c: record.atg_gameroom__External_Id__c},
              record,function(err) {
                if (err) {
                  cb("Could not update record", null);
                } else {
                  cb(null, record);
                }
              });
          }
        }
    });
  }

  /** Create or update database record */
  function createOrSaveMatch(record, cb) {
    Match.findOne(
      {atg_gameroom__External_Id__c: record.atg_gameroom__External_Id__c},
      function(err, match) {
        if (err) {
          cb("Could not retreive record", null);
        } else {
          // create match if not found
          if (!match) {
            // Create match
            var newMatch = new Match(record);

            newMatch.save(function(err) {
              if (err) {
                cb("Could not create record", null);
              } else {
                cb(null, newMatch);
              }
            });

          } else {
            // update match
            Match.findOneAndUpdate(
              {atg_gameroom__External_Id__c: record.atg_gameroom__External_Id__c},
              record,function(err) {
                if (err) {
                  cb("Could not update record", null);
                } else {
                  cb(null, record);
                }
              });
          }
        }
    });
  }

  /** Create or update database record */
  function createOrSaveFeatureRequest(record, cb) {
    FeatureRequest.findOne(
      {atg_gameroom__External_Id__c: record.atg_gameroom__External_Id__c},
      function(err, featureRequest) {
        if (err) {
          cb("Could not retreive record", null);
        } else {
          // create featureRequest if not found
          if (!featureRequest) {
            // Create featureRequest
            var newFeatureRequest = new FeatureRequest(record);

            newFeatureRequest.save(function(err) {
              if (err) {
                cb("Could not create record", null);
              } else {
                cb(null, newFeatureRequest);
              }
            });

          } else {
            // update featureRequest
            FeatureRequest.findOneAndUpdate(
              {atg_gameroom__External_Id__c: record.atg_gameroom__External_Id__c},
              record,function(err) {
                if (err) {
                  cb("Could not update record", null);
                } else {
                  cb(null, record);
                }
              });
          }
        }
    });
  }

  /////////////// DB Fetch Methods //////////////////////

  function fetchPlayers(cb) {
    Player.find({}, cb);
  }

  function fetchPlayerMatches(cb) {
    PlayerMatch.find({}, cb);
  }

  function fetchMatches(cb) {
    Match.find({}, cb);
  }

  function fetchFeatureRequests(cb) {
    FeatureRequest.find({}, cb);
  }

  /////////////// EXPORTED PUBLIC FUNCTIONS //////////////////

  module.exports.genIdIfNotExist = genIdIfNotExist;
  module.exports.createOrUpdateRecord = createOrUpdateRecord;
  module.exports.getObjForRecordType = getObjForRecordType;
  module.exports.fetchAllRecords = fetchAllRecords;
  module.exports.createOrUpdateAll = createOrUpdateAll;

})();
