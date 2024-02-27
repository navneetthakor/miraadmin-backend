// to setup routers
const express = require('express');
const router = express.Router();

// to check parameters provided in body or not 
const {body} = require('express-validator');

// importing middlewares 
const fetchAdmin = require('../middlewares/fetchAdmin');

// importing controllers 
const createOrder = require('../controllers/order/createOrder');
const fetchAllOrders = require('../controllers/order/fetchAllOrders');
const fetchCustomerOrders = require('../controllers/order/fetchCustomerOrders');

// ------------ROUTE:1 (creating order )-----------------
router.post('/createOrder',
[
    body("products", "please provide products").isArray(),
    body("customer_id", "please provide customer id").not().isEmpty(),
    body("address", "please provide customer id").not().isEmpty(),
    body("amount", "enter amount").isNumeric(),
    body("method", "provide method").not().isEmpty(),
],
createOrder);

// ----------ROUTE:2 (fetch all orders)----------------
// ----------Only admin can perform this operation
router.post('/fetchAllOrders',
fetchAdmin,
fetchAllOrders);

// ------ROUTE:3 (fetch single Order)-------------
router.post('/fetchCustomerOrders',
[
    body("customer_id","please provide customer_id").not().isEmpty()
],
fetchCustomerOrders);

module.exports = router;
