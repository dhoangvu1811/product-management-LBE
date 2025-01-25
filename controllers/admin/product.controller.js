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
        .sort({ pos: 'desc' })
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

    await Product.updateOne({ _id: id }, { status: status });

    req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');
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
            req.flash(
                'success',
                `Cập nhật trạng thái ${ids.length} sản phẩm thành công`
            );
            break;
        case 'inactive':
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: 'inactive' }
            );
            req.flash(
                'success',
                `Cập nhật trạng thái ${ids.length} sản phẩm thành công`
            );
            break;
        case 'delete-all':
            await Product.updateMany(
                { _id: { $in: ids } },
                { deleted: true, deletedAt: new Date() }
            );
            req.flash('success', `Xoá ${ids.length} sản phẩm thành công`);
            break;
        case 'change-position':
            for (const item of ids) {
                let [id, position] = item.split('-');
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { pos: position });
            }
            req.flash(
                'success',
                `Thay đổi vị trí ${ids.length} sản phẩm thành công`
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
    req.flash('success', 'Đã xoá sản phẩm thành công');
    res.redirect('back');
};
