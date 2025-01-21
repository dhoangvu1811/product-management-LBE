const Product = require('../../model/product.model');

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: false,
    });
    console.log(products);
    res.render('admin/pages/products/index', {
        titlePage: 'Trang sản phẩm',
        products: products,
    });
};
