const { getDb } = require('../utils/database');

class Product {
  constructor({
    title,
    imageUrl,
    description,
  }) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {
    const db = getDb();
    return db.collection('products').insertOne(this)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
