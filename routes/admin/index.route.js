const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const productCategory = require('./product-category.route');
const { prefixAdmin } = require('../../config/system');
module.exports = (app) => {
    const PATH_ADMIN = prefixAdmin;
    app.use(PATH_ADMIN + '/dashboard', dashboardRoutes);

    app.use(PATH_ADMIN + '/products', productRoutes);

    app.use(PATH_ADMIN + '/products-category', productCategory);
};
