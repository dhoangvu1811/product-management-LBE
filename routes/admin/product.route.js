const express = require('express');
const router = express.Router();
const multer = require('multer');
const storageMulter = require('../../helpers/storageMulter');
// const upload = multer({ storage: storageMulter() });
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const productController = require('../../controllers/admin/product.controller');
const validate = require('../../validates/admin/product.validate');

router.get('/', productController.index);
router.patch('/change-status/:status/:id', productController.changeStatus);
router.patch('/change-multi', productController.changeMulti);
router.delete('/delete/:id', productController.deleteItem);
router.get('/create', productController.createItem);
router.post(
    '/create',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    productController.createItemPost
);
router.get('/edit/:id', productController.editItem);
router.patch(
    '/edit/:id',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.updatePatch,
    productController.editItemPatch
);

router.get('/trash', productController.trashItem);
router.patch('/trash/restore/:id', productController.trashRestoreItem);
router.delete(
    '/trash/delete-permanently/:id',
    productController.trashDeletePermanentlyItem
);
router.get('/detail/:id', productController.detailItem);

module.exports = router;
