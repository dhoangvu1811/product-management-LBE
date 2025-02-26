const Product = require('../../model/product.model');
const Account = require('../../model/account.model');
const ProductCategory = require('../../model/product-category.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require('../../config/system');
const createTreeHelper = require('../../helpers/createTree');

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

    //phân trang
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        req.query,
        {
            currentPage: 1,
            limitItems: 4,
        },
        countProducts
    );

    //sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = 'desc';
    }

    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    for (const product of products) {
        const account = await Account.findOne({
            _id: product.createdBy.account_id,
        });
        if (account) {
            product.accountFullName = account.fullName;
        }
    }

    res.render('admin/pages/products/index', {
        titlePage: 'Trang sản phẩm',
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
    });
};

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;

    await Product.updateOne({ _id: id }, { status: status });

    req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');
    res.redirect('back');
};

//[PATCH] /admin/products/change-multi/ (change position, delete all)
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
                {
                    deleted: true,
                    deletedBy: {
                        account_id: res.locals.user.id,
                        deletedAt: new Date(),
                    },
                    $unset: { restoredBy: '' },
                }
            );
            req.flash('success', `Xoá ${ids.length} sản phẩm thành công`);
            break;
        case 'change-position':
            for (const item of ids) {
                let [id, position] = item.split('-');
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
            }
            req.flash(
                'success',
                `Thay đổi vị trí ${ids.length} sản phẩm thành công`
            );
            break;
        case 'restore':
            await Product.updateMany(
                { _id: { $in: ids } },
                {
                    deleted: false,
                    restoredBy: {
                        account_id: res.locals.user.id,
                        restoredAt: new Date(),
                    },
                    $unset: { deletedBy: '' },
                }
            );
            req.flash('success', `Khôi phục ${ids.length} sản phẩm thành công`);
            break;
        case 'delete-permanently':
            await Product.deleteMany({ _id: { $in: ids } });
            req.flash('success', `Xoá ${ids.length} sản phẩm thành công`);
            break;
        default:
            break;
    }

    res.redirect('back');
};

//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const idItem = req.params.id;
    // await Product.deleteOne({ _id: idItem });
    await Product.updateOne(
        { _id: idItem },
        {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date(),
            },
            $unset: { restoredBy: '' }, // Xoá trường restoredBy
        }
    );
    req.flash('success', 'Đã xoá sản phẩm thành công');
    res.redirect('back');
};

//[GET] /admin/products/create
module.exports.createItem = async (req, res) => {
    let find = {
        deleted: false,
    };
    const records = await ProductCategory.find(find);
    const newReacords = createTreeHelper.tree(records);

    res.render('admin/pages/products/create', {
        titlePage: 'Thêm mới sản phẩm',
        categorys: newReacords,
    });
};
//[POST] /admin/products/create
module.exports.createItemPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == '') {
        const count = await Product.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    req.body.createdBy = {
        account_id: res.locals.user.id,
        createdAt: new Date(),
    };
    const product = new Product(req.body);
    await product.save();
    req.flash('success', 'Tạo sản phẩm mới thành công');

    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

//[GET] /admin/products/edit/:id
module.exports.editItem = async (req, res) => {
    try {
        const id = req.params.id;

        const records = await ProductCategory.find({ deleted: false });
        const newReacords = createTreeHelper.tree(records);
        const product = await Product.findOne({ _id: id, deleted: false });

        res.render('admin/pages/products/edit', {
            titlePage: 'Chỉnh sửa sản phẩm',
            product: product,
            categorys: newReacords,
        });
    } catch (error) {
        req.flash('error', 'id sản phẩm không tồn tại!');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};
//[PATCH] /admin/products/edit/:id
module.exports.editItemPatch = async (req, res) => {
    const id = req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    try {
        await Product.updateOne({ _id: id }, req.body);
        req.flash('success', 'Chỉnh sửa sản phẩm thành công');
    } catch (error) {
        req.flash('error', 'Chỉnh sửa sản phẩm thất bại!');
    }

    res.redirect('back');
};

//[GET] /admin/products/trash
module.exports.trashItem = async (req, res) => {
    //bộ lọc theo status
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: true,
    };

    if (req.query.status) {
        find.status = req.query.status;
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
        .sort({ position: 'desc' })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    for (const product of products) {
        const account = await Account.findOne({
            _id: product.deletedBy.account_id,
        });
        if (account) {
            product.accountFullName = account.fullName;
        }
    }
    res.render('admin/pages/products/trash', {
        titlePage: 'Thùng rác',
        products: products,
        filterStatus: filterStatus,
        pagination: objectPagination,
    });
};

//[PATCH] /admin/products/trash/restore/:id
module.exports.trashRestoreItem = async (req, res) => {
    try {
        const id = req.params.id;
        await Product.updateOne(
            { _id: id },
            {
                deleted: false,
                restoredBy: {
                    account_id: res.locals.user.id,
                    restoredAt: new Date(),
                },
                $unset: { deletedBy: '' },
            }
        );
        req.flash('success', 'Khôi phục sản phẩm thành công');
    } catch (error) {
        req.flash('error', 'Khôi phục sản phẩm thất bại');
    }
    res.redirect('back');
};

//[DELETE] /admin/products/trash/delete-permanently/:id
module.exports.trashDeletePermanentlyItem = async (req, res) => {
    try {
        const id = req.params.id;
        await Product.deleteOne({ _id: id });
        req.flash('success', 'Xoá sản phẩm thành công');
    } catch (error) {
        req.flash('error', 'Xoá sản phẩm thất bại');
    }
    res.redirect('back');
};

//[GET] /admin/products/detail/:id
module.exports.detailItem = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.findOne({ _id: id, deleted: false });

        res.render('admin/pages/products/detail', {
            titlePage: product.title,
            product: product,
        });
    } catch (error) {
        req.flash('error', 'id sản phẩm không tồn tại!');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};
