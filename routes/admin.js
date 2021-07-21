const express = require('express');
const { body } = require('express-validator/check');

const router = express.Router();

const auth = require('../middleware/auth');
const adminController = require('../controllers/admin');

router.get('/add-product', auth, adminController.getAddProduct);
router.post(
  '/add-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 100 })
      .trim(),
  ],
  auth,
  adminController.postAddProduct,
);

router.get('/edit-product/:id', auth, adminController.getEditProduct);
router.post('/edit-product', [
  body('title')
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body('price').isFloat(),
  body('description')
    .isLength({ min: 5, max: 100 })
    .trim(),
],
auth, adminController.postEditProduct);

router.post('/delete-product', auth, adminController.postDeleteProduct);

router.get('/product-list', auth, adminController.getProducts);

exports.routes = router;
