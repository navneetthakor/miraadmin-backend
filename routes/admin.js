// to use the express 
const express = require('express');
const router = express.Router();

// to validate the given parameter in request 
const {body} = require('express-validator');

// importing fetchAdmin middleware
// will use it in '/getAdmin' end point
const fetchAdmin = require('../middlewares/fetchAdmin');

// to upload profile image 
const upload = require('../middlewares/fetchImages');

// importing controllers 
const createAdmin = require('../controllers/admin/createAdmin');
const adminLogin = require('../controllers/admin/adminLogin');
const adminAuthtokenLogin = require('../controllers/admin/adminAuthtokenLogin');

// --------------------------------ROUTE:1 admin signup -----------------------------------
router.post('/createadmin',
[
    body('name', "Please enter name ").not().isEmpty(),
    body('email', "enter a valid email").isEmail(),
    body('password', "please enter password with length more then 6 ").isLength({min:6})
],
upload.single('image'),
createAdmin);


// ----------------------------------ROUTE:2 admin login (No previous login require)-------------------

router.post('/login',
[
    body("email","please enter valid email ").isEmail(),
    body("password", "Please enter valid pasword ").not().isEmpty()
],
adminLogin);

// ----------------ROUTE:3 login user using authtoken (previously login required)-----------------------------------
router.post('/getadmin', 
fetchAdmin, 
adminAuthtokenLogin);

module.exports = router;