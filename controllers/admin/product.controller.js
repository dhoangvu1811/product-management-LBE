const Product = require('../../model/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');

// [GET] /admin/products
module.exports.index = async (req, res) => {
    //bộ lọc theo status
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false,
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    let keyword = '';

    if (req.query.keyword) {
        keyword = req.query.keyword;

        // "i" không phân biệt chữ hoa chữ thường
        const regex = new RegExp(keyword, 'i');
        find.title = regex;
    }

    const products = await Product.find(find);
    res.render('admin/pages/products/index', {
        titlePage: 'Trang sản phẩm',
        products: products,
        filterStatus: filterStatus,
        keyword: keyword,
    });
};
