/* eslint-disable no-underscore-dangle, no-param-reassign , no-shadow, no-console */
const fs = require('fs');
const path = require('path');
const PdfDocument = require('pdfkit');
const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        products,
        path: '/',
        csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => res.render('shop/product-list', {
      products,
      pageTitle: 'All products',
      path: '/product-list',
    }))
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res) => {
  const { id } = req.params;

  Product.findById(id)
    .then((product) => {
      res.render('shop/product-details', {
        product,
        pageTitle: product.title,
        path: '',
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res) => {
  req.user
    .populate('cart.items.id')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddToCart = (req, res) => {
  const { productId } = req.body;
  return Product.findById(productId)
    .then((product) => req.user.addToCart(product))
    .then(() => res.redirect('/cart'))
    .catch((err) => console.log(err));
};

exports.postDeleteCartProduct = (req, res) => {
  const { productId } = req.body;

  req.user.deleteCartProduct(productId)
    .then(() => res.redirect('/cart'))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  const { _id } = req.user;

  Order.find({ 'user.userId': _id })
    .then((orders) => {
      res.render('shop/orders', {
        pageTitle: 'Your Order',
        path: '/orders',
        orders,
      });
    });
};

exports.postOrder = (req, res) => {
  const { email, _id } = req.user;
  req.user
    .populate('cart.items.id')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((item) => ({
        quantity: item.quantity,
        product: { ...item.id._doc },
      }));

      const order = new Order({
        user: { email, userId: _id },
        products,
      });
      return order.save();
    })
    .then(() => {
      req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};

exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params;
  const { _id } = req.user;

  Order.findById(orderId)
    .then((order) => {
      if (`${order.user.userId}` !== `${_id}`) {
        return next(new Error('Unauthorized'));
      }

      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join('data', 'invoices', invoiceName);
      const pdfDoc = new PdfDocument();

      res.setHeader('Content-type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename"${invoiceName}"`);

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', { underline: true });
      pdfDoc.text('--------------');

      order.products.forEach((prod) => {
        pdfDoc.fontSize(20).text(`${prod.product.title} - ${prod.quantity} x ??${prod.product.price}`);
      });

      pdfDoc.end();
    })
    .catch((err) => next(err));
};
