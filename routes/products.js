// to use router provided by express.js module
const express = require("express");
const router = express.Router();

// to validate the parameters provided by the user
const { body, validationResult } = require("express-validator");

// to get connectivity with collection of product in backend using mongooes
const Product = require("../models/Product");

//for admin authentication
const Admin = require("../models/Admin");

// to upload images
const upload = require("../middlewares/fetchImages");

// importing fetchAdmin middleware
// will use it in '/getAdmin' end point
const fetchAdmin = require("../middlewares/fetchAdmin");

// to delete images
// used in update Product route 
const fs = require('fs');
const path = require('path');

// importing controllers 
const addProduct = require('../controllers/product/addProduct');
const deleteProduct = require("../controllers/product/deleteProduct");
const updateProducts = require("../controllers/product/updateProduct");
const fetchAllProducts = require("../controllers/product/fetchAllProducts");
const fetchLimiteCategoryProducts = require("../controllers/product/fetchLimitedCategoryProducts");
const fetchCategoryProducts = require("../controllers/product/fetchCategoryProducts");

// -------------------------ROUTE:1 to add product -------------------------------------
router.post(
  "/addprod",
  upload.array("images"),
  fetchAdmin,
  [
    body("title", "please enter tiltle with min length of : 6").isLength({min: 6}),
    body("desc", "please enter valid descretion format").not().isEmpty(),
    body("category", "please enter valid descretion format").not().isEmpty(),
    body("sellprice", "please enter valid price.").isNumeric(),
  ],
  addProduct
);

// -------------------------ROUTE:2 to delete product (byID) -------------------------------------
router.delete("/deleteprod/:id", fetchAdmin, deleteProduct);

// -------------------------ROUTE:3 to update product -------------------------------------
router.put("/updateprod/:id",
fetchAdmin, 
upload.array('images'),
updateProducts);

// -----------------------ROUT:4 fetch all the products -----------------.
router.post('/fetchallprods', fetchAllProducts);


// ------------------------ROUT:5 fetch limited data----------------------
router.post('/fetchlimitprods',
fetchLimiteCategoryProducts);


// ----------------------ROUT:6 fetch all but particular category products----------------
router.post('/fetchcategoryprods', 
fetchCategoryProducts);

module.exports = router;
