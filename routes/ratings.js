// to use express 
const express = require('express');
const router = express.Router();

// to validate body of request 
const {body} = require('express-validator');

// importing controllers 
const createRating = require('../controllers/Rating/createRating.js');
const addReview = require('../controllers/Rating/addReview.js');
const updateReview = require('../controllers/Rating/updateReview.js');
const deleteRating = require('../controllers/Rating/deleteRating.js');
const getRating = require('../controllers/Rating/getRating.js')
// ----------------Route:1 (create Rating document - when product is added)----------------
router.post('/createRating',
[
    body("product_id","please provide product id").not().isEmpty()
],
createRating);

// -----------------Route:2 (to add brand new Review )-----------------
router.put('/addReview',
[
    body("customer_id", "please enter valid customer id").not().isEmpty(),
    body("product_id", "please enter valid product id").not().isEmpty(),
    body("rate", "please enter valid numeric value").isNumeric(),
    body("desc", "please enter description").not().isEmpty(),
],
addReview);

// ----------------Route:3 (to update old review)-------- 
router.put('/updateReview',
[
    body("customer_id", "please enter valid customer id").not().isEmpty(),
    body("product_id", "please enter valid product id").not().isEmpty(),
    body("rate", "please enter valid numeric value").isNumeric(),
    body("desc", "please enter description").not().isEmpty(),
],
updateReview);

// ---------------Route:4 (to delete Rating document)------------------
router.delete('/deleteRating',
[
    body("product_id", "please enter valid product id").not().isEmpty()
],
deleteRating);

// ---------------Route:5 (to get rating document)--------------
router.post('/getRating',
[
    body("product_id", "please enter valid product id").not().isEmpty()
],
getRating);

module.exports = router;