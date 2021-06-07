/* eslint-disable no-console */
const path = require('path');

const express = require('express');
const bodyPareser = require('body-parser');

const sequelize = require('./utils/database');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyPareser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // forword request to public folder

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    }).catch((err) => console.log(err));
});
app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use('/', errorsController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// sequelize.sync({ force: true })
sequelize.sync()
  .then(() => User.findByPk(1))
  .then((user) => {
    if (!user) return User.create({ userName: 'sara', email: 'sara@gmail.com' });
    return user;
  })
  .then((user) => user.createCart())
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
