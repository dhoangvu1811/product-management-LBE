const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/product.controller');

router.get('/', productController.index);
router.patch('/change-status/:status/:id', productController.changeStatus);
router.patch('/change-multi', productController.changeMulti);
router.delete('/delete/:id', productController.deleteItem);
router.get('/create', productController.createItem);
router.post('/create', productController.createItemPost);

module.exports = router;
