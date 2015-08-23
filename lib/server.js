"use strict";

var tooBusy = require('toobusy-js'),
  Express = require('express'),
  compress = require('compression'),
  bodyParser = require('body-parser'),
  expressValidator = require('express-validator'),
  helmet = require('helmet'),
  http = require('http'),
  Router = require('./router'),
  ejs = require('ejs'),
  Handler = require('./handler'),
  authenticationMiddleware = require('./auth'),
  config = require(process.env.MKT_CONFIG_FILE),
  app = new Express();

/**
 * Creates the Portal Server
 *
 * @constructor
 */
function Server() {

  // configure express js for html
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(expressValidator());
  app.use(compress());

  // add basic web security
  app.use(helmet.hsts({
    maxAge: 10886400000,
    includeSubdomains: true,
    preload: true
  }));
  app.use(helmet.xssFilter());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());

  // add busy middleware for overloaded server state
  app.use(function tooBusyMiddleware(req, res, next) {
    tooBusy() ? res.status(503).json({
      "status": "BUSY",
      "message": "Ups :( We're sorry, it seems the server is toobusy right now...please try again later..."
    }) : next();
  });

  app.set('view engine', 'html');
  app.engine('.html', ejs.__express);
  app.set('views', __dirname + '/../views');
  app.use(Express.static(__dirname + '/../public'));

  app.use('/mkt/', authenticationMiddleware, Router.init());
}

/**
 * Starts the HTTP Server
 */
Server.prototype.start = function () {

  var server = http.createServer(app).listen(config.PORTAL.PORT, config.PORTAL.IP, function callback() {
      console.log('MKT Portal started ...');
    });

  Handler.realTimeRedis(server);
};

module.exports = Server;
