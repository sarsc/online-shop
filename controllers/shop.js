/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
const Product = require('../models/product');

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
    .then((products) => res.render('shop/product-list', {
      products,
      pageTitle: 'All products',
      path: '/product-list',
    }))
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

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((cart) => cart.getProducts()
      .then((products) => {
        res.render('shop/cart', {
          pageTitle: 'Your Cart',
          path: '/cart',
          products,
        });
      }))
    .catch((err) => console.log(err));
};

exports.postAddToCart = (req, res) => {
  const { productId } = req.body;
  let fetchedCart;
  let quantity = 1;

  req.user.getCart()
    .then((cart) => {
      console.log(cart, 'WJEFKJHWEUFHNFRKJWHEFKH');
      fetchedCart = cart;

      return cart.getProducts({ where: { productId } });
    })
    .then((products) => {
      let product;

      if (products.length > 0) {
        [product] = products;
      }

      if (product) {
        quantity = product.cartItem.quantity + 1;

        return product;
      }

      return Product.findByPk(productId);
    })
    .then((product) => fetchedCart.addProduct(product, { through: { quantity } }))
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.postDeleteCartProduct = (req, res) => {
  const { productId } = req.body;

  req.user.getCart()
    .then((cart) => cart.getProducts({ where: { productId } }))
    .then((products) => {
      const [product] = products;
      return product.cartItem.destroy();
    })
    .then(() => res.redirect('/cart'))
    .catch((err) => console.log(err));
};

exports.getOrder = (req, res) => {
  req.user.getOrders({ include: ['products'] })
    .then((orders) => {
      res.render('shop/orders', {
        pageTitle: 'Your Order',
        path: '/orders',
        orders,
      });
    });
};

exports.postOrder = (req, res) => {
  let fetchedCart;
  req.user.getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      req.user.createOrder()
        .then((order) => {
          const mappedProd = products.map((prod) => {
            prod.orderItem = { quantity: prod.cartItem.quantity };
            return prod;
          });
          return order.addProducts(mappedProd);
        });
    })
    .then(() => {
      fetchedCart.setProducts(null);
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};
