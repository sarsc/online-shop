/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const path = require('path');

const express = require('express');
const bodyPareser = require('body-parser');

const { mongodbConnect } = require('./utils/database');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyPareser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // forword request to public folder

app.use((req, res, next) => {
  User.findById('60c21bd59ece7cf0f7400712')
    .then((user) => {
      req.user = new User({
        userName: user.userName, email: user.email, id: user._id, cart: user.cart,
      });
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use('/', errorsController.get404);

mongodbConnect(() => {
  app.listen(3001);
});
