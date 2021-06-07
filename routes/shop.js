const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/product-list', shopController.getProducts);
router.get('/product-list/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postAddToCart);
router.post('/delete-cart-item', shopController.postDeleteCartProduct);

router.get('/orders', shopController.getOrder);
router.post('/create-order', shopController.postOrder);

module.exports = router;
