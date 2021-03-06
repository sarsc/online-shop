/* eslint-disable no-underscore-dangle, no-console, no-shadow */
const path = require('path');

const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyPareser = require('body-parser');
const mongoose = require('mongoose');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorsController = require('./controllers/errors');

const User = require('./models/user');
const key = require('./key');

const { mongodbUrl } = key;
const MONGODB_URI = mongodbUrl;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
});
const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});

app.set('view engine', 'ejs');

app.use(bodyPareser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).single('image'));

// forword request to public folder
app.use(express.static(path.join(__dirname, 'public')));

// forword request to image folder if it exist
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store,
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }

      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorsController.get500);
app.use(errorsController.get404);

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => { // error handling middleware
  res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
