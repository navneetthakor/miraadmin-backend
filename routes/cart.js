// to use express 
const express = require('express');
const router = express.Router();

// to validate body of request 
const {body} = require('express-validator');

// importing controllers 
const createCart = require('../controllers/cart/createCart');
const addToCart = require('../controllers/cart/addToCart');
const addToFav = require('../controllers/cart/addToFav');
const deleteToCart = require('../controllers/cart/deleteToCart');
const deleteToFav = require('../controllers/cart/deleteToFav');
const getCart = require('../controllers/cart/getCart');

// ----------------Route:1 (creation of cart for user - when new user is created)------------------- 
router.post('/createCart',
[
    body("customer_id", "please provide customer ID").not().isEmpty()
],
createCart);

// ----------------Route:2 (add one product to Cart)---------------
router.post('/addToCart',
[
    body("customer_id", "please add product id").not().isEmpty(),
    body("product_id", "please add product id").not().isEmpty(),
    body("quantity", "please add product id").isNumeric()
],
addToCart);

// ----------------Route:3 (add one entry to fav)---------------
router.post('/addToFav',
[
    body("customer_id", "please add product id").not().isEmpty(),
    body("product_id", "please add product id").not().isEmpty(),
    body("quantity", "please add product id").isNumeric()
],
addToFav);

// -----------------Route:4 (remove One provided Entry from Cart)-------
router.delete('/deleteToCart',
[
    body("customer_id", "please provide Customer Id").not().isEmpty(),
    body("product_id", "please add product id").not().isEmpty(),
],
deleteToCart)

// -----------------Route:5 (remove one provided entry from Cart)--------
router.delete('/deleteToFav',
[
    body("customer_id", "please provide Customer Id").not().isEmpty(),
    body("product_id", "please add product id").not().isEmpty(),
],
deleteToFav)

// -----------------Route:6 (get Cart)---------------------------
router.post('/getCart',
[
    body("customer_id", "please provide Customer Id").not().isEmpty()
],
getCart);

module.exports = router;


// ************Issue**************
// cart creates new entry for every new request instead of merging quantity with entry 
// (if already that product exists in cart then it's valid point)