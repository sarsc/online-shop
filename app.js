/* eslint-disable no-underscore-dangle, no-console, no-shadow */
const path = require('path');

const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyPareser = require('body-parser');
const mongoose = require('mongoose');
const csrf = require('csurf');
const flash = require('connect-flash');

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

app.set('view engine', 'ejs');

app.use(bodyPareser.urlencoded({ extended: false }));
// forword request to public folder
app.use(express.static(path.join(__dirname, 'public')));
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
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);
app.use('/', errorsController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
