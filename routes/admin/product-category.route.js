const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const validate = require('../../validates/admin/product-category.validate');
const productCategoryController = require('../../controllers/admin/product-category.controller');

router.get('/', productCategoryController.index);
router.get('/create', productCategoryController.create);
router.post(
    '/create',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    productCategoryController.createPost
);
router.patch(
    '/change-status/:status/:id',
    productCategoryController.changeStatus
);
router.patch('/change-multi', productCategoryController.changeMulti);

router.get('/trash', productCategoryController.trashItem);
router.patch('/trash/restore/:id', productCategoryController.trashRestoreItem);
router.delete(
    '/trash/delete-permanently/:id',
    productCategoryController.trashDeletePermanentlyItem
);

module.exports = router;
