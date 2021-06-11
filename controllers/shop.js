/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
const Product = require('../models/product');

exports.getIndex = (req, res) => {
  Product.fetchAll()
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
  Product.fetchAll()
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
    .getCart()
    .then((products) => {
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

// exports.getOrder = (req, res) => {
//   req.user.getOrders({ include: ['products'] })
//     .then((orders) => {
//       res.render('shop/orders', {
//         pageTitle: 'Your Order',
//         path: '/orders',
//         orders,
//       });
//     });
// };

// exports.postOrder = (req, res) => {
//   let fetchedCart;
//   req.user.getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then((products) => {
//       req.user.createOrder()
//         .then((order) => {
//           const mappedProd = products.map((prod) => {
//             prod.orderItem = { quantity: prod.cartItem.quantity };
//             return prod;
//           });
//           return order.addProducts(mappedProd);
//         });
//     })
//     .then(() => {
//       fetchedCart.setProducts(null);
//       res.redirect('/orders');
//     })
//     .catch((err) => console.log(err));
// };
