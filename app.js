const path = require('path');

const express = require('express');
const bodyPareser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

const errorsController = require('./controllers/errors');

app.set('view engine', 'ejs')

app.use(bodyPareser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public'))) //forword request to public folder

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use('/', errorsController.get404);

app.listen(3000);