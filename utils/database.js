/* eslint-disable no-underscore-dangle, no-console */
const mongodb = require('mongodb');
const key = require('../key');

const { MongoClient } = mongodb;
const { mongodbUrl } = key;

let _db;

const mongodbConnect = (callback) => {
  // MongoClient.connect(mongodbURL)
  MongoClient.connect(mongodbUrl)
    .then((client) => {
      _db = client.db('shop');
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (!_db) {
    throw new Error('Database not found');
  }
  return _db;
};

exports.mongodbConnect = mongodbConnect;
exports.getDb = getDb;
