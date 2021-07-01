/* eslint-disable no-param-reassign , no-console */
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

  const product = new Product({
    title,
    imageUrl,
    description,
    price,
    userId: req.user,
  });

  product.save()
    .then(() => {
      res.redirect('/admin/product-list');
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  const { id } = req.params;
  Product.findById(id)
    .then((product) => {
      if (!product) {
        return res.redirect('/admin/product-list');
      }

      return res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        isEdited: editMode,
        product,

      });
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
  const { user } = req;

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== user._id.toString()) {
        return res.redirect('/');
      }

      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      product.save()
        .then(() => {
          res.redirect('/admin/product-list');
        });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;
  const { user } = req;

  Product.deleteOne({ _id: productId, userId: user._id })
    .then(() => {
      res.redirect('/admin/product-list');
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res) => {
  const { user } = req;
  Product.find({ userId: user._id })
    .then((products) => res.render('admin/product-list', {
      products,
      pageTitle: 'Admin products',
      path: '/admin/product-list',

    }))
    .catch((err) => console.log(err));
};
