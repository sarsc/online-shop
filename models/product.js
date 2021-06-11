/* eslint-disable no-underscore-dangle, no-console */
const mongodb = require('mongodb');
const { getDb } = require('../utils/database');

const { ObjectId } = mongodb;

const getProductsCollection = () => {
  const db = getDb();
  return db.collection('products');
};

class Product {
  constructor({
    title,
    imageUrl,
    description,
    price,
    id,
    userId,
  }) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this._id = id && new ObjectId(id);
    this.userId = userId;
  }

  save() {
    let dbOp;
    if (this._id) {
      dbOp = getProductsCollection()
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = getProductsCollection()
        .insertOne(this);
    }

    return dbOp
      .then((res) => console.log('res'))
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    return getProductsCollection().find().toArray()
      .then((products) => products)
      .catch((err) => console.log(err));
  }

  static findById(id) {
    return getProductsCollection().find({ _id: new ObjectId(id) })
      .next()
      .then((product) => product)
      .catch((err) => console.log(err));
  }

  static deleteById(id) {
    return getProductsCollection()
      .deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Product;
