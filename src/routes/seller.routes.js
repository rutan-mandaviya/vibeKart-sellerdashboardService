const express = require('express');
const router = express.Router();
const { CreateauthMiddleware } = require('../middleware/auth.middleware');
const SellerController = require('../Controllers/seller.controller');

router.get('/metrics', CreateauthMiddleware(['seller']), SellerController.getMetrics);
router.get('/orders', CreateauthMiddleware(['seller']), SellerController.getOrders);
router.get('/products', CreateauthMiddleware(['seller']), SellerController.getProducts);


module.exports = router;