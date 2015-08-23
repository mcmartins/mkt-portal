"use strict";

var BeeQueue = require('bee-queue'),
  config = require(process.env.MKT_CONFIG_FILE);

/**
 * Job Queue using the module bee-queue.
 * Initializes the bee-queue module using redis server.
 */
module.exports.init = function () {

  return new BeeQueue(config.REDIS.QUEUE, {
    prefix: config.REDIS.PREFIX,
    stallInterval: 5000,
    redis: {
      host: config.REDIS.HOST,
      port: config.REDIS.PORT,
      db: 0,
      options: {}
    },
    getEvents: true,
    isWorker: false,
    sendEvents: false,
    removeOnSuccess: false,
    catchExceptions: false
  });
};
