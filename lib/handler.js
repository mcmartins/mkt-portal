"use strict";

var async = require('async'),
  DAO = require('./database'),
  MessagesDAO = new DAO(),
  io = require('socket.io'),
  jobQueue = require('./queue').init(),
  config = require(process.env.MKT_CONFIG_FILE);

/**
 * Handles GET Request on /mkt/portal
 *
 * @param req
 * @param res
 */
module.exports.main = function (req, res) {
  res.render('index.html', {url: ['http://', config.PORTAL.HOST, ':', config.PORTAL.SOCKET_PORT].join('')});
};

/**
 * Handles GET Request on /mkt/portal
 */
module.exports.realTimeRedis = function (server) {
  io.listen(server).on('connection', function(socket) {
    jobQueue.on('job succeeded', function (jobId, result) {
      socket.emit('job succeeded', {job: jobId, result: result});
    });

    jobQueue.on('job retrying', function (jobId, err) {
      socket.emit('job retrying', {job: jobId, result: err});
    });

    jobQueue.on('job failed', function (jobId, err) {
      socket.emit('job failed', {job: jobId, result: err});
    });

    jobQueue.on('job progress', function (jobId, progress) {
      socket.emit('job progress', {job: jobId, result: progress});
    });
  });
};



/**
 * Handles GET Requests and returns JSON object containing MongoDB stats
 *
 * @param req
 * @param res
 */
module.exports.getDataGroupByCurrency = function (req, res) {
  MessagesDAO.group(10, function (err, data) {
    if (err) {
      res.status(500).send();
    }
    res.send(data);
  });
};

/**
 * Handles GET Requests and returns JSON object containing MongoDB stats
 *
 * @param req
 * @param res
 */
module.exports.getLastProcessed = function (req, res) {
  MessagesDAO.find(undefined, 10, function (err, data) {
    if (err) {
      res.status(500).send();
    }
    res.send(data);
  });
};
