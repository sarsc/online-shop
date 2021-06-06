/* eslint-disable no-console */
const Product = require('../models/product');
// const Cart = require('../models/cart');

exports.getIndex = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        products,
        path: '/',
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'All products',
        path: '/product-list',
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res) => {
  const { productId } = req.params;

  Product.findByPk(productId)
    .then((product) => {
      res.render('shop/product-details', {
        product,
        pageTitle: product.title,
        path: '',
      });
    })
    .catch((err) => console.log(err));
};

// exports.getCart = (req, res) => {
//   Cart.getCart((cart) => {
//     Product.fetchAll((products) => {
//       const cartProducts = [];

//       products.forEach((product) => {
//         const cartProductData = cart.products
//           .find((cartProd) => cartProd.productId === product.productId);
//         if (cartProductData) {
//           cartProducts.push({ product, quantity: cartProductData.quantity });
//         }
//       });

//       res.render('shop/cart', {
//         pageTitle: 'Your Cart',
//         path: '/cart',
//         cartProducts,
//       });
//     });
//   });
// };

// exports.postCart = (req, res) => {
//   const { productId } = req.body;
//   Product.findById(productId, (product) => {
//     Cart.addProduct(productId, product.price);
//   });
//   res.redirect('/cart');
// };

// exports.postDeleteCartProduct = (req, res) => {
//   const { productId } = req.body;
//   Product.findById(productId, (product) => {
//     Cart.deleteProduct(productId, product.price);
//     res.redirect('/cart');
//   });
// };
