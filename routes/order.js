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
const fetchSingleOrder = require('../controllers/order/fetchSingleOrder');
const fetchCustomer = require('../middlewares/fetchCustomer');
const updateOrder = require('../controllers/order/updateOrder')
// ------------ROUTE:1 (creating order )-----------------
router.post('/order',
fetchCustomer,
[
    body("products", "please provide products").isArray(),
    body("address", "please provide customer id").not().isEmpty(),
    body("mobile", "please provide valid mobile number").not().isEmpty(),
    body("email", "please provide valid email").isEmail(),
    body("amount", "enter amount").isNumeric(),
    body("method", "provide method").not().isEmpty(),
],
createOrder);
// ------------ROUTE:2 (update order )-----------------
router.put('/updateOrder',
fetchAdmin,
[
    body("order_id", "please provide order_id").not().isEmpty(),
    body("status", "provide status").not().isEmpty(),
],
updateOrder);

// ----------ROUTE:2 (fetch all orders)----------------
// ----------Only admin can perform this operation
router.post('/fetchAllOrders',
fetchAdmin,
fetchAllOrders);

// ------ROUTE:3 (fetch CUSTOMER'S Order)-------------
router.post('/fetchCustomerOrders',
[
    body("customer_id","please provide customer_id").not().isEmpty()
],
fetchCustomerOrders);

// ----------ROUTE:4 (tech single order)----------
// --not sure whether will use this route or not
router.post('/fetchSingleOrder',
[
    body("order_id", "please provide order id").not().isEmpty()
],
fetchSingleOrder)
module.exports = router;
