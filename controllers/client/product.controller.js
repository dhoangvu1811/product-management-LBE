module.exports.index = (req, res) => {
    res.render('client/pages/products/index', {
        titlePage: 'Danh sách sản phẩm',
    });
};
