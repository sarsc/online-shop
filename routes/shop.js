const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');
const auth = require('../middleware/auth');

router.get('/', shopController.getIndex);

router.get('/product-list', shopController.getProducts);
router.get('/product-list/:id', shopController.getProduct);

router.get('/cart', auth, shopController.getCart);
router.post('/cart', auth, shopController.postAddToCart);
router.post('/delete-cart-item', auth, shopController.postDeleteCartProduct);

router.get('/orders', auth, shopController.getOrders);
router.post('/create-order', auth, shopController.postOrder);

module.exports = router;
