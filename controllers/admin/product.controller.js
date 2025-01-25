const Product = require('../../model/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');

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

    //tìm kiếm
    const objectSearch = searchHelper(req.query);

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        req.query,
        {
            currentPage: 1,
            limitItems: 4,
        },
        countProducts
    );

    const products = await Product.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    res.render('admin/pages/products/index', {
        titlePage: 'Trang sản phẩm',
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
    });
};

//[PATCH] /change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;

    // console.log(`${id} - ${status}`);
    await Product.updateOne({ _id: id }, { status: status });
    res.redirect('back');
};

//[PATCH] /change-multi/:status/:id
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');

    switch (type) {
        case 'active':
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: 'active' }
            );
            break;
        case 'inactive':
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: 'inactive' }
            );
            break;
        case 'delete-all':
            await Product.updateMany(
                { _id: { $in: ids } },
                { deleted: true, deletedAt: new Date() }
            );
            break;
        default:
            break;
    }

    res.redirect('back');
};

//[DELETE] /delete/:id
module.exports.deleteItem = async (req, res) => {
    const idItem = req.params.id;
    // await Product.deleteOne({ _id: idItem });
    await Product.updateOne(
        { _id: idItem },
        { deleted: true, deletedAt: new Date() }
    );
    res.redirect('back');
};
