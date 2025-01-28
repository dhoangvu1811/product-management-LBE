const express = require('express');
const router = express.Router();
const multer = require('multer');
const storageMulter = require('../../helpers/storageMulter');
const upload = multer({ storage: storageMulter() });
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
    validate.createPost,
    productController.createItemPost
);

module.exports = router;
