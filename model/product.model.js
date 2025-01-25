const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    pos: Number,
    deleted: Boolean,
    deletedAt: Date,
});

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
