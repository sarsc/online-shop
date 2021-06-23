const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const adminController = require('../controllers/admin');

router.get('/add-product', auth, adminController.getAddProduct);
router.post('/add-product', auth, adminController.postAddProduct);

router.get('/edit-product/:id', auth, adminController.getEditProduct);
router.post('/edit-product', auth, adminController.postEditProduct);

router.post('/delete-product', auth, adminController.postDeleteProduct);

router.get('/product-list', auth, adminController.getProducts);

exports.routes = router;
