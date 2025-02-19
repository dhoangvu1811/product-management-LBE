module.exports.createPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('error', 'Vui lòng nhập tiêu đề!');
        res.redirect('back');
        return;
    }
    next();
};
