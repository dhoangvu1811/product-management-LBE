const ProductCategory = require('../../model/product-category.model');
const systemConfig = require('../../config/system');

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };

    const records = await ProductCategory.find(find);

    res.render('admin/pages/products-category/index', {
        titlePage: 'Trang danh mục sản phẩm',
        records: records,
    });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/products-category/create', {
        titlePage: 'Thêm danh mục sản phẩm',
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
