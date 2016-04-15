(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var syncDataController = require('./controllers/syncDataController');

  /** Routes */
  router.get('/player', syncDataController.getPlayer);
  router.post('/player', syncDataController.postPlayer);

  router.get('/playerMatch', syncDataController.getPlayerMatch);
  router.post('/playerMatch', syncDataController.postPlayerMatch);

  router.get('/match', syncDataController.getMatch);
  router.post('/match', syncDataController.postMatch);

  router.get('/featureRequest', syncDataController.getFeatureRequest);
  router.post('/featureRequest', syncDataController.postFeatureRequest);

  router.get('/all', syncDataController.getAll);
  router.post('/all', syncDataController.postAll);

  module.exports = router;

})();
