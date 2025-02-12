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

//[GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const record = await Role.findOne({ _id: id });

        res.render('admin/pages/role/detail', {
            titlePage: 'Trang chi tiết nhóm quyền',
            record: record,
        });
    } catch (error) {
        req.flash('error', 'Lỗi khi tải thông tin nhóm quyền!');
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const record = await Role.findOne({ _id: id, deleted: false });

        res.render('admin/pages/role/edit', {
            titlePage: 'Trang chỉnh sửa nhóm quyền',
            record: record,
        });
    } catch (error) {
        req.flash('error', 'Lỗi khi tải thông tin nhóm quyền!');
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

//[PATCH] /admin/roles/edit/:id
module.exports.editpatch = async (req, res) => {
    try {
        const id = req.params.id;

        const record = await Role.updateOne({ _id: id }, req.body);

        req.flash('success', 'Chỉnh sửa nhóm quyền thành công');
        res.redirect('back');
    } catch (error) {
        req.flash('error', 'Chỉnh sửa nhóm quyền thất bại!');
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

//[DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        const record = await Role.updateOne({ _id: id }, { deleted: true });

        req.flash('success', 'Xoá nhóm quyền thành công');
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } catch (error) {
        req.flash('error', 'Xoá nhóm quyền thất bại!');
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

// [GET] /admin/roles/permission
module.exports.permission = async (req, res) => {
    const records = await Role.find({ deleted: false });

    res.render('admin/pages/role/permission', {
        titlePage: 'Trang phân quyền',
        records: records,
    });
};
// [PATCH] /admin/roles/permission
module.exports.permissionPatch = async (req, res) => {
    try {
        //parse chuỗi json thành mảng
        const permissions = JSON.parse(req.body.permissions);
        for (const item of permissions) {
            const id = item.id;
            const permissions = item.permissions;

            await Role.updateOne({ _id: id }, { permissions: permissions });
        }

        req.flash('success', 'Cập nhật phân quyền thành công');
    } catch (error) {
        req.flash('error', 'Cập nhật phân quyền thất bại!');
    }
    res.redirect('back');
};
