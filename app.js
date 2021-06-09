/* eslint-disable no-console */
const path = require('path');

const express = require('express');
const bodyPareser = require('body-parser');

const { mongodbConnect } = require('./utils/database');
const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyPareser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // forword request to public folder

app.use('/admin', adminRoutes.routes);
// app.use(shopRoutes);
app.use('/', errorsController.get404);

mongodbConnect(() => {
  app.listen(3000);
});
