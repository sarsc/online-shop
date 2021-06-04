/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const roothPath = require('../utils/getPath');

const productPath = path.join(roothPath, 'data', 'product.json');

const getProductData = (callback) => {
  fs.readFile(productPath, (err, data) => {
    if (err) return callback([]);
    const products = JSON.parse(data);
    return callback(products);
  });
};

class Product {
  constructor({
    productId, title, imageUrl, description, price,
  }) {
    this.productId = productId;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductData((products) => {
      if (this.productId) {
        const existingProductIndex = products.findIndex((product) => product.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(productPath, JSON.stringify(updatedProducts), (err) => {
          console.log(err, 'err');
        });
      } else {
        this.productId = Math.random().toString();
        products.push(this);
        fs.writeFile(productPath, JSON.stringify(products), (err) => {
          console.log(err, 'err');
        });
      }
    });
  }

  static fetchAll(callback) {
    getProductData(callback);
  }

  static findById(id, callback) {
    getProductData((products) => {
      const product = products.find((prod) => prod.id === id);
      callback(product);
    });
  }
}

module.exports = Product;
