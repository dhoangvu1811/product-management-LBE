const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
    {
        title: String,
        product_category_id: {
            type: String,
            default: '',
        },
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        position: Number,
        slug: { type: String, slug: 'title', unique: true },
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
            },
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedBy: {
            account_id: String,
            deletedAt: {
                type: Date,
            },
        },
        restoredBy: {
            account_id: String,
            restoredAt: {
                type: Date,
            },
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
