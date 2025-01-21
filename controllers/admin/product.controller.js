const Product = require('../../model/product.model');

// [GET] /admin/products
module.exports.index = async (req, res) => {
    let filterStatus = [
        {
            name: 'Tất cả',
            status: '',
            class: '',
        },
        {
            name: 'Hoạt động',
            status: 'active',
            class: '',
        },
        {
            name: 'Dừng hoạt động',
            status: 'inactive',
            class: '',
        },
    ];

    if (req.query.status) {
        const index = filterStatus.findIndex((item) => {
            return item.status == req.query.status;
        });
        filterStatus[index].class = 'active';
    } else {
        const index = filterStatus.findIndex((item) => {
            return item.status == '';
        });
        filterStatus[index].class = 'active';
    }

    let find = {
        deleted: false,
    };

    if (req.query.status) {
        find.status = req.query.status;
    }
    const products = await Product.find(find);
    res.render('admin/pages/products/index', {
        titlePage: 'Trang sản phẩm',
        products: products,
        filterStatus,
    });
};
