const Account = require('../../model/account.model');
const md5 = require('md5');
const systemConfig = require('../../config/system');

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
    res.render('admin/pages/auth/login', {
        titlePage: 'Đăng nhập',
    });
};
// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
        email: email,
        deleted: false,
    });
    if (!user) {
        req.flash('error', 'Tài khoản không tồn tại!');
        return res.redirect('back');
    } else if (md5(password) != user.password) {
        req.flash('error', 'Sai mật khẩu!');
        return res.redirect('back');
    } else if (user.status == 'inactive') {
        req.flash('error', 'Tài khoản đã bị khoá!');
        return res.redirect('back');
    }

    res.cookie('token', user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
