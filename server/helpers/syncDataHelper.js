(function(){
  'use strict';
  var crypto = require('crypto');
  var async = require('async');

  /** Generate ID - PRIVATE */
  function genId() {
    return crypto.randomBytes(16).toString('hex');
  }
  /** Generate id if one does not already exist - PUBLIC */
  function genIdIfNotExist(record) {
    if (!record.atg_gameroom__External_Id__c) {
      record.atg_gameroom__External_Id__c = genId();
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
      recordType = recordTyperecordType.toLowerCase();
      // build object with specific fields based on model
      record = getObjForRecordType(record, recordType);
      if (recordType === 'player') {
        createOrSavePlayer(record, cb);
      } else if (recordType === 'match') {
        createOrSaveMatch(record, cb);
      } else if (recordType === 'playerMatch') {
        createOrSavePlayerMatch(record, cb);
      } else if (recordType === 'featureRequest') {
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

    /**
     * Create or update all records of all types
     * @param  {Object}   records Object with keys matching the record type names
     * @param  {Function} cb      Callback function(err, records)
     * @return {Object}           Object of all created records
     */
  function createOrUpdateAll(records, cb) {
    // Loop all records, determine if any of them already exist.
    // For items that do ot exist, we have to insert
    try {
      var errors = [];
      async.parallel({
        players: function(callback){
          var players = [];
          if (records.hasOwnProperty('players')) {
            for (var i = 0; i < records.players.length; i++) {
              createOrUpdateRecord(records.players[i], 'player', function(err, recordOutput) {
                // not sure if I need to do aything here (or if I can)
                if (err) {
                  errors.push({error: err, object: 'player'});
                } else {
                  players.push(recordOutput);
                }
                if (i === records.players.length) {
                  callback(null, players);
                }
              });
            }
            // object was not included as input
          } else {
            callback(null, players);
          }
        },
        playerMatches: function(callback){
          var playerMatches = [];
          if (records.hasOwnProperty('playerMatches')) {
            for (var i = 0; i < records.playerMatches.length; i++) {
              createOrUpdateRecord(records.playerMatches[i], 'playerMatch', function(err, recordOutput) {
                // not sure if I need to do aything here (or if I can)
                if (err) {
                  errors.push({error: err, object: 'playerMatch'});
                } else {
                  playerMatches.push(recordOutput);
                }
                if (i === records.playerMatches.length) {
                  callback(null, playerMatches);
                }
              });
            }
            // object was not included as input
          } else {
            callback(null, playerMatches);
          }
        },
        matches: function(callback){
          var matches = [];
          if (records.hasOwnProperty('matches')) {
            for (var i = 0; i < records.matches.length; i++) {
              createOrUpdateRecord(records.matches[i], 'match', function(err, recordOutput) {
                // not sure if I need to do aything here (or if I can)
                if (err) {
                  errors.push({error: err, object: 'match'});
                } else {
                  matches.push(recordOutput);
                }
                if (i === records.matches.length) {
                  callback(null, matches);
                }
              });
            }
            // object was not included as input
          } else {
            callback(null, matches);
          }
        },
        featureRequests: function(callback){
          var featureRequests = [];
          if (records.hasOwnProperty('featureRequests')) {
            for (var i = 0; i < records.featureRequests.length; i++) {
              createOrUpdateRecord(records.featureRequests[i], 'featureRequest', function(err, recordOutput) {
                // not sure if I need to do aything here (or if I can)
                if (err) {
                  errors.push({error: err, object: 'featureRequest'});
                } else {
                  featureRequests.push(recordOutput);
                }
                if (i === records.featureRequests.length) {
                  callback(null, featureRequests);
                }
              });
            }
            // object was not included as input
          } else {
            callback(null, featureRequests);
          }
        }
      },
      function(err, results) {
          if (err || errors.length > 0) {
            if (err) errors.push({error: err, object: 'unknown'});
            cb(errors, results);
          } else {
            cb(null, results);
          }
      });

      recordType = recordTyperecordType.toLowerCase();
      // build object with specific fields based on model
      record = getObjForRecordType(record, recordType);
      if (records.hasOwnProperty('player')) {
        createOrUpdateRecord(records.player, 'player', function(err, recordOutput) {

          if (records.hasOwnProperty('player')) {
            createOrUpdateRecord(records.player, 'player', function(err, recordOutput) {

              if (records.hasOwnProperty('player')) {
                createOrUpdateRecord(records.player, 'player', function(err, recordOutput) {

                  if (records.hasOwnProperty('player')) {
                    createOrUpdateRecord(records.player, 'player', function(err, recordOutput) {

                  });
                  }
              });
              }
          });
          }
        });
      }

    } catch(err) {
      cb(err, null);
    }
  }

  }

  /** Get object based on data model instead of trusting record input - PUBLIC */
  function getObjForRecordType(record, recordType) {
    recordType = recordTyperecordType.toLowerCase();
    returnRecord = {};

    if (recordType === 'player') {
      record = {
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
        Name: record.Name,
        atg_gameroom__External_Id__c: record.atg_gameroom__External_Id__c,
        atg_gameroom__Game__c: record.atg_gameroom__Game__c,
        atg_gameroom__Score_Recorded_Date__c: record.atg_gameroom__Score_Recorded_Date__c
      };
    } else if (recordType === 'playerMatch') {
      returnRecord = {
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
    } else if (recordType === 'featureRequest') {
      returnRecord = {
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
