const express = require('express');

const { check } = require('express-validator')
const router = express.Router();
const shopController = require('../controllers/shop');

router.get('/', shopController.getSearchProduct);

router.get('/search', shopController.getSearchItem);

router.get('/cart', shopController.getCartItem);

router.get('/addToCart/:product_id', shopController.addToCart);

router.get('/details/:product_id', shopController.getProductDetail);

router.get('/deleteProductCart/:product_id', shopController.deleteProductCart);

exports.routes = router;