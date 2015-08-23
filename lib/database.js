"use strict";

var MongoDBClient = require('mongodb').MongoClient,
  config = require(process.env.MKT_CONFIG_FILE);

/**
 *
 * @constructor
 */
function Database() {

  var self = this;
  var connectionString = ['mongodb://', config.MONGODB.HOST, ':', config.MONGODB.PORT, '/', config.MONGODB.DB].join('');

  MongoDBClient.connect(connectionString, function (err, database) {
    if (err) {
      console.error('Couldn\'t connect to database using the connection string: ' + connectionString);
      throw err;
    }
    console.info('Successfully connected to MongoDB collection: ' + config.MONGODB.COLLECTION);
    self.database = database;
    self.collection = self.database.collection(config.MONGODB.COLLECTION);
  });
}

Database.prototype.insert = function (object, callback) {
  this.collection.insertOne(object, callback);
};

Database.prototype.find = function (criteria, limit, callback) {
  this.collection.find(criteria).limit(limit).sort({timePlaced: -1}).toArray(callback);
};

Database.prototype.group = function (limit, callback) {
  this.collection.aggregate([{
    "$group": {
      "_id": {"from": "$currencyFrom", "to": "$currencyTo"},
      "count": {"$sum": 1}
    }
  },{
    $sort: {count: -1}
  },{
    $limit : limit
  }], callback)
};

Database.prototype.count = function (criteria, callback) {
  this.collection.count(criteria, callback);
};

module.exports = Database;