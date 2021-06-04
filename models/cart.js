/* eslint-disable no-shadow */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const roothPath = require('../utils/getPath');

const cartPath = path.join(roothPath, 'data', 'cart.json');

class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(cartPath, (err, data) => {
      let cart = { products: [], totalPrice: 0 };

      if (!err) {
        cart = JSON.parse(data);
      }
      const existingProductIndex = cart.products.findIndex((product) => product.productId === id);
      const existingProduct = cart.products[existingProductIndex];

      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { productId: id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += +productPrice;

      fs.writeFile(cartPath, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(cartPath, (err, data) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(data) };
      const product = updatedCart.products.find((prod) => prod.productId === id);
      const { quantity } = product;
      updatedCart.products = updatedCart.products.filter((prod) => prod.productId !== id);
      updatedCart.totalPrice -= productPrice * quantity;

      fs.writeFile(cartPath, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(callback) {
    fs.readFile(cartPath, (err, data) => {
      if (err) return callback(null);
      const cart = JSON.parse(data);
      return callback(cart);
    });
  }
}

module.exports = Cart;
