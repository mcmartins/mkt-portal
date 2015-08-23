"use strict";

var Handler = require('./handler'),
  Express = require('express'),
  router = Express.Router();

/**
 * Creates the Portal Routes
 */
module.exports.init = function () {

  router.get('/portal', Handler.main);

  router.get('/processed', Handler.getLastProcessed);

  router.get('/currency', Handler.getDataGroupByCurrency);

  return router;
};