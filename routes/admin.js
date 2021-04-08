const express = require('express');

const { check } = require('express-validator')
const router = express.Router();

const productsController = require('../controllers/products');

// /admin/add-product => GET
router.get('/', productsController.getSearchProduct);
router.get('/', productsController.getSearchProduct);

router.get('/insert', productsController.getAddProduct);

router.get('/update/:product_id', productsController.getUpdateProduct);

// /admin/add-product => POST
router.post('/insert', [
    check('product_name').trim().not().isEmpty().withMessage("product name is required"),
    check('price').isFloat({ gt: 0 }).withMessage("greater than zero"),
    check('amount').isInt({ gt: -1}).withMessage("integer and not negative"),
], productsController.postAddProduct);

router.post('/update', [
    check('product_id').not().isEmpty().withMessage("empty"),
    check('product_name').trim().isLength({ min: 1 }).withMessage("product name is required"),
    check('price').isFloat({ gt: 0 }).withMessage("greater than zero"),
    check('amount').isInt({  gt: -1}).withMessage("integer and not negative"),
], productsController.postUpdateProduct);

router.get('/search', productsController.getSearchItem);

router.get('/delete/:product_id', productsController.getDeleteProduct);

exports.routes = router;