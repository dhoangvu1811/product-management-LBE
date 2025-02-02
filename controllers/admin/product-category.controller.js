const ProductCategory = require('../../model/product-category.model');
const systemConfig = require('../../config/system');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };

    //bộ lọc theo status
    const filterStatus = filterStatusHelper(req.query);

    //tìm kiếm
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    if (req.query.status) {
        find.status = req.query.status;
    }

    //sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = 'desc';
    }

    const records = await ProductCategory.find(find).sort(sort);

    res.render('admin/pages/products-category/index', {
        titlePage: 'Trang danh mục danh mục',
        records: records,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
    });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/products-category/create', {
        titlePage: 'Thêm danh mục danh mục',
    });
};

//[POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == '') {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    req.flash('success', 'Tạo danh mục thành công');
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

//[PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;

    await ProductCategory.updateOne({ _id: id }, { status: status });

    req.flash('success', 'Cập nhật trạng thái danh mục thành công!');
    res.redirect('back');
};

//[PATCH] /admin/products-category/change-multi/:status/:id (change position, delete all)
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');

    switch (type) {
        case 'active':
            await ProductCategory.updateMany(
                { _id: { $in: ids } },
                { status: 'active' }
            );
            req.flash(
                'success',
                `Cập nhật trạng thái ${ids.length} danh mục thành công`
            );
            break;
        case 'inactive':
            await ProductCategory.updateMany(
                { _id: { $in: ids } },
                { status: 'inactive' }
            );
            req.flash(
                'success',
                `Cập nhật trạng thái ${ids.length} danh mục thành công`
            );
            break;
        case 'delete-all':
            await ProductCategory.updateMany(
                { _id: { $in: ids } },
                { deleted: true, deletedAt: new Date() }
            );
            req.flash('success', `Xoá ${ids.length} danh mục thành công`);
            break;
        case 'change-position':
            for (const item of ids) {
                let [id, position] = item.split('-');
                position = parseInt(position);
                await ProductCategory.updateOne(
                    { _id: id },
                    { position: position }
                );
            }
            req.flash(
                'success',
                `Thay đổi vị trí ${ids.length} danh mục thành công`
            );
            break;
        case 'restore':
            await ProductCategory.updateMany(
                { _id: { $in: ids } },
                { deleted: false }
            );
            req.flash('success', `Khôi phục ${ids.length} danh mục thành công`);
            break;
        case 'delete-permanently':
            await ProductCategory.deleteMany({ _id: { $in: ids } });
            req.flash('success', `Xoá ${ids.length} danh mục thành công`);
            break;
        default:
            break;
    }

    res.redirect('back');
};
