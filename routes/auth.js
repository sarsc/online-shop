const express = require('express');
const { check } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup',
  [check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
      const { email } = req.body;

      return User.findOne({ email })
        .then((userData) => {
          if (userData) {
            return Promise.reject('Email already exist, please use a different one.');
          }
        });
    }),
  check('password')
    .isLength({ min: 5 }),
  check('confirmPassword')
    .custom((value, { req }) => {
      if (value === req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  ],
  authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
