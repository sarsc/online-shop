/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    isEdited: false,
  });
};

exports.postAddProduct = (req, res) => {
  const { title } = req.body;
  const { imageUrl } = req.body;
  const { description } = req.body;
  const { price } = req.body;
  Product.create({
    title,
    imageUrl,
    description,
    price,
  }).then(() => {
    res.redirect('/admin/product-list');
  })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  const { productId } = req.params;

  Product.findByPk(productId)
    .then((product) => {
      if (product) {
        return res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          isEdited: editMode,
          product,
        });
      }
      return res.redirect('/');
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const {
    productId,
    title,
    imageUrl,
    description,
    price,
  } = req.body;
  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;

      return product.save();
    })
    .then(() => {
      res.redirect('/admin/product-list');
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;
  Product.findByPk(productId)
    .then((product) => product.destroy())
    .then(() => {
      res.redirect('/admin/product-list');
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('admin/product-list', {
        products,
        pageTitle: 'Admin products',
        path: 'admin/product-list',
      });
    })
    .catch((err) => console.log(err));
};
