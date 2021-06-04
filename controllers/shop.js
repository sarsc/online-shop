/* eslint-disable no-console */
const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All products',
      path: '/product-list',
      hasProducts: products.length > 0,
    });
  });
};

exports.getProduct = (req, res) => {
  const { id } = req.params;

  Product.findById(id, (product) => {
    res.render('shop/product-details', {
      product,
      pageTitle: product.title,
      path: '',
    });
  });
};

exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      pageTitle: 'Shop',
      prods: products,
      path: '/',
      hasProducts: products.length > 0,
    });
  });
};

exports.getCart = (req, res) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart',
  });
};

exports.postCart = (req, res) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};
