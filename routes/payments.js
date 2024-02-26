// to use router provided by express.js 
const express = require("express");
const router = express.Router();

// to validate body of request 
const {body} = require('express-validator');

// importing reuqired middlewares 
const fetchAdmin = require('../middlewares/fetchAdmin');

// importing controllers 
const createPayment = require('../controllers/payment/createPayment');
const updatePayment = require('../controllers/payment/updatePayment');
const fetchSinglePayment = require('../controllers/payment/fetchSinglePayment');
const fetchAllPayment = require('../controllers/payment/fetchAllPayment');



// ----------------ROUTE:1 (create Payment, will be called at time of order creation)--------------
router.post('/create',
[
    body("customer_id", "provide valid customer id").not().isEmpty(),
    body("amount", "provide numeric amount value").isNumeric(),
    body("method","enter method of payment").not().isEmpty(),
    body("country","please provide country").not().isEmpty(),
],
createPayment)

// ------------ROUTE:2 (update payment details)------------
// ---Admin will perform this operation 
router.post('/update',
[
    body("payment_id", "please provide valid payment id").not().isEmpty()
],
updatePayment);


// ----------ROUTE:3 (fetch single payment )---------
router.post('/fetchSinglePayment',
[
    body("payment_id","please provide valid payment id").not().isEmpty(),
],
fetchSinglePayment);

// -------ROUTE:4 (fetch all payments)-------
router.post('/fetchAllPayment', fetchAdmin, fetchAllPayment);

module.exports = router

