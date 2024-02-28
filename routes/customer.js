// to use the express 
const express = require('express');
const router = express.Router();

// to validate the given parameter in request 
const {body} = require('express-validator');

//fetchCustomer middleware to fetch data from auth-token
const fetchCustomer = require('../middlewares/fetchCustomer');
const fetchAdmin = require('../middlewares/fetchAdmin');

// to upload images 
const upload = require('../middlewares/fetchImages');


// importing controllers 
const createCustomer = require('../controllers/customer/createCustomer');
const customerLogin = require('../controllers/customer/customerLogin');
const custmrAuthtokenLogin = require('../controllers/customer/custmrAuthtokenLogin');
const updateCustomer = require('../controllers/customer/updateCustomer');
const fetchAllCustomers = require('../controllers/customer/fetchAllCustomers');

// --------------------------ROUTE:1 create custmr account ----------------------------------------------------------
router.post('/createcustmr',
upload.single('image'),
[
    body("name", "please enter name").not().isEmpty(),
    body("email", "please enter valid email").isEmail(),
    body("password", "please enter password with minimum length of : 6").isLength({min:6})
],
createCustomer);


// --------------------------ROUTE:2 login to account (previous login not require) ----------------------------------------------------------
router.post('/login',
[
    body("email", "please enter valid email").isEmail(),
    body("password", "please do enter your password").not().isEmpty()
],
customerLogin);


// --------------------------ROUTE:3 login to accoutn with authtoken ( previous login not require) ----------------------------------------------------------
router.post('/getcustmr', 
fetchCustomer , 
custmrAuthtokenLogin);


//  --------------------------Route:4 to update profile (login required) --------------------------
router.put('/updatecustmr',
fetchCustomer,
upload.single('image'),
updateCustomer);

//  ----------------------------- Route:5 fetchall Customers (only for admin) ---------------
router.post('/getallcustomers',fetchAdmin ,fetchAllCustomers)


module.exports = router;