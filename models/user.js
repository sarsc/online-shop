/* eslint-disable class-methods-use-this, no-console , func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [{
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    }],
  },
});

userSchema.methods.addToCart = function (product) {
  const { _id } = product;

  const cartProductIndex = this.cart.items
    .findIndex((cartProd) => {
      console.log(cartProd.id);
      return `${cartProd.id}` === `${_id}`;
    });

  let updatedQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    updatedQuantity += updatedQuantity + 1;
    updatedCartItems[cartProductIndex].quantity = updatedQuantity;
  } else {
    updatedCartItems.push({ id: _id, quantity: updatedQuantity });
  }

  const updatedCart = { items: updatedCartItems };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteCartProduct = function (prodId) {
  const updatedCartItems = this.cart.items.filter((item) => `${item.id}` !== `${prodId}`);
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
