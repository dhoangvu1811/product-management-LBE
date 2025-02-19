const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const validate = require('../../validates/admin/account.validate');
const accountController = require('../../controllers/admin/account.controller');

router.get('/', accountController.index);
router.get('/create', accountController.create);
router.post(
    '/create',
    upload.single('avatar'),
    uploadCloud.upload,
    validate.createPost,
    accountController.createPost
);

module.exports = router;
