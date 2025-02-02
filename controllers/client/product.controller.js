const Product = require('../../model/product.model');

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: 'active',
        deleted: false,
    }).sort({ position: 'desc' });

    const newProdcts = products.map((item) => {
        item.priceNew = (
            (item.price * (100 - item.discountPercentage)) /
            100
        ).toFixed(0);
        return item;
    });
    res.render('client/pages/products/index', {
        titlePage: 'Danh sách sản phẩm',
        products: newProdcts,
    });
};

// [GET] /:slug
module.exports.detailItem = async (req, res) => {
    try {
        const slug = req.params.slug;

        const find = {
            deleted: false,
            slug: slug,
            status: 'active',
        };

        const productDetail = await Product.findOne(find);

        res.render('client/pages/products/detail', {
            titlePage: productDetail.title,
            productDetail: productDetail,
        });
    } catch (error) {
        res.redirect('/products');
    }
};
