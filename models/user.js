/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const mongodb = require('mongodb');
const { getDb } = require('../utils/database');

const { ObjectId } = mongodb;
const getCollection = (collection = 'users') => {
  const db = getDb();
  return db.collection(collection);
};

class User {
  constructor({
    userName, email, id, cart,
  }) {
    this.userName = userName;
    this.email = email;
    this.cart = cart;
    this._id = id && new ObjectId(id);
  }

  save() {
    return getCollection().insertOne(this);
  }

  static findById(id) {
    return getCollection().findOne({ _id: new ObjectId(id) });
  }

  getCart() {
    const cartProductsIds = this.cart.items.map((item) => item._id);
    return getCollection('products').find({ _id: { $in: cartProductsIds } })
      .toArray()
      .then((products) => products.map((product) => {
        const productQuantity = this.cart.items
          .find((item) => `${item._id}` === `${product._id}`).quantity;
        return { ...product, quantity: productQuantity };
      }));
  }

  addToCart(product) {
    const { _id } = product;
    const cartProductIndex = this.cart.items
      .findIndex((cartProd) => `${cartProd._id}` === `${_id}`);
    let updatedQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      updatedQuantity += updatedQuantity + 1;
      updatedCartItems[cartProductIndex].quantity = updatedQuantity;
    } else {
      updatedCartItems.push({ _id, quantity: updatedQuantity });
    }

    const updatedCart = { items: updatedCartItems };

    return getCollection()
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  deleteCartProduct(prodId) {
    const updatedCart = this.cart.items.filter((item) => `${item._id}` !== `${prodId}`);

    return getCollection().updateOne({ _id: new ObjectId(this._id) },
      { $set: { cart: { items: updatedCart } } });
  }
}

module.exports = User;
