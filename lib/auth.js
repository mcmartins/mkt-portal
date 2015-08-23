"use strict";

var basicAuth = require('basic-auth');

/**
 * Simple Basic Authentication mechanism for use with ExpressJs and secure Kue api.
 * Shouldn't be used in production!
 */
module.exports = function isAuthorized(req, res, next) {

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  } else if (user.name === 'admin' && user.pass === 'admin') {
    return next();
  } else {
    return unauthorized(res);
  }
};

/**
 * Function used to restrict access to a specific route
 */
function unauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
  return res.send(401);
}