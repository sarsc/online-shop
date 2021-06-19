/* eslint-disable no-underscore-dangle, no-console, no-shadow */
const path = require('path');

const express = require('express');
const bodyPareser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors');
const User = require('./models/user');
const key = require('./key');

const app = express();
const { mongodbUrl } = key;

app.set('view engine', 'ejs');

app.use(bodyPareser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // forword request to public folder

app.use((req, res, next) => {
  User.findById('60c8df3cc58f460dac67deee')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use('/', errorsController.get404);

mongoose
  .connect(mongodbUrl)
  .then(() => {
    User.findOne()
      .then((user) => {
        if (!user) {
          const user = new User({
            name: 'Sara',
            email: 'sar@test.com',
            cart: {
              items: [],
            },
          });
          user.save();
        }
        app.listen(3000);
      });
  })
  .catch((err) => console.log(err));
