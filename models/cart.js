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
      const existingProductIndex = cart.products.findIndex((product) => product.id === id);
      const existingProduct = cart.products[existingProductIndex];

      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = existingProduct;
      } else {
        updatedProduct = { id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += +productPrice;

      fs.writeFile(cartPath, JSON.stringify(cart), (err) => {
        console.log(err, 'err');
      });
    });
  }
}

module.exports = Cart;
