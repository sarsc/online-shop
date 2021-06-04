const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    isEdited: false,
  });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  const { productId } = req.params;
  Product.findById(productId, (product) => {
    if (product) {
      return res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        isEdited: editMode,
        product,
      });
    }
    res.redirect('/');
  });
};

exports.postEditProduct = (req, res) => {
  const {
    productId,
    title,
    imageUrl,
    description,
    price,
  } = req.body;

  const updatedProduct = new Product({
    title,
    imageUrl,
    description,
    price,
    productId,
  });

  updatedProduct.save();
  res.redirect('/');
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
    productId: null,
  });

  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('admin/product-list', {
      prods: products,
      pageTitle: 'Admin products',
      path: 'admin/product-list',
      hasProducts: products.length > 0,
    });
  });
};
