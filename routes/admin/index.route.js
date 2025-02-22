const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const productCategory = require('./product-category.route');
const roles = require('./role.route');
const accounts = require('./account.route');
const auth = require('./auth.route');
const { prefixAdmin } = require('../../config/system');
const authMiddleware = require('../../middlewares/admin/auth.middleware');

module.exports = (app) => {
    const PATH_ADMIN = prefixAdmin;
    app.use(
        PATH_ADMIN + '/dashboard',
        authMiddleware.requireAuth,
        dashboardRoutes
    );

    app.use(
        PATH_ADMIN + '/products',
        authMiddleware.requireAuth,
        productRoutes
    );

    app.use(
        PATH_ADMIN + '/products-category',
        authMiddleware.requireAuth,
        productCategory
    );

    app.use(PATH_ADMIN + '/roles', authMiddleware.requireAuth, roles);

    app.use(PATH_ADMIN + '/accounts', authMiddleware.requireAuth, accounts);

    app.use(PATH_ADMIN + '/auth', auth);
};
