const Role = require('../../model/role.model');
const systemConfig = require('../../config/system');

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };

    const records = await Role.find(find);
    res.render('admin/pages/role/index', {
        titlePage: 'Trang nhóm quyền',
        records: records,
    });
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/role/create', {
        titlePage: 'Trang tạo nhóm quyền',
    });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();

    req.flash('success', 'Tạo nhóm quyền thành công');

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
};
