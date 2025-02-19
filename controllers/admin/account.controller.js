const Account = require('../../model/account.model');
const Role = require('../../model/role.model');
const systemConfig = require('../../config/system');
const md5 = require('md5');

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };
    //lấy tất cả các trường ngoại trừ password và token
    const records = await Account.find(find).select('-password -token');

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false,
        });
        record.role = role;
    }

    res.render('admin/pages/accounts/index', {
        titlePage: 'Trang danh sách tài khoản',
        records: records,
    });
};
// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    let records = [];
    try {
        records = await Role.find({ deleted: false });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách vai trò:', error);
        req.flash('error', 'Không thể tải danh sách vai trò');
    }

    res.render('admin/pages/accounts/create', {
        titlePage: 'Tạo mới tài khoản',
        records: records,
    });
};
// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    try {
        const emailExist = await Account.findOne({
            email: req.body.email,
            deleted: false,
        });
        if (emailExist) {
            req.flash('error', 'Email tài khoản trùng lặp!');
            return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
        }
        req.body.password = md5(req.body.password);

        const account = new Account(req.body);
        await account.save();

        req.flash('success', 'Tạo mới tài khoản thành công');
        return res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    } catch (error) {
        console.error('Lỗi khi tạo tài khoản:', error);

        req.flash('error', `Tạo tài khoản thất bại: ${error.message}`);
        return res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};
