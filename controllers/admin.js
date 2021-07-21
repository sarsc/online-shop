/* eslint-disable no-param-reassign , no-console */
const { validationResult } = require('express-validator/check');

const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    isEdited: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const {
    title,
    description,
    price,
  } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      isEdited: false,
      hasError: true,
      product: {
        title,
        description,
        price,
      },
      errorMessage: 'Attached file is not an image',
      validationErrors: [],
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      isEdited: false,
      hasError: true,
      product: {
        title,
        description,
        price,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const imageUrl = `/${image.path}`;

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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
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
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const {
    productId,
    title,
    description,
    price,
  } = req.body;
  const image = req.file;
  const { user } = req;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      isEdited: true,
      hasError: true,
      product: {
        title,
        imageUrl,
        description,
        price,
        _id: productId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== user._id.toString()) {
        return res.redirect('/');
      }

      product.title = title;
      product.description = description;
      product.price = price;

      if (image) {
        product.imageUrl = image.path;
      }

      product.save()
        .then(() => {
          res.redirect('/admin/product-list');
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
      hasError: false,
    }))
    .catch((err) => console.log(err));
};
