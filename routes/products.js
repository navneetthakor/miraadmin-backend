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
  async (req, res) => {
    try {
      // first of all check whether this request is made by admin or not
      // fetching the id provided by fetchAdmin middleware
      const adminId = req.admin.id;

      // gethering the details of admin with provided id
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return res
          .status(401)
          .json({ error: "Authentication fail please login", signal: "red" });
      }

      // check the validation for given parameters in body
      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res.status(400).json({ error: err.array(), signal: "red" });
      }

      let temp;
      // Check if files were uploaded
      if (req.files && req.files.length > 0) {
        const imagePaths = req.files.map((file) => file.path);

         temp = new Product({
          images: imagePaths,
          title: req.body.title,
          desc: req.body.desc,
          company: req.body.company,
          dimension: req.body.dimension,
          weight: req.body.weight,
          mrp: req.body.mrp,
          sellprice: req.body.sellprice,
          category: req.body.category,
          sku: req.body.sku,
          stock: req.body.prodname,
          soldstock: req.body.prodname
        });
      }
      temp.save();
      return res.json({ product: temp, signal: "green" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ email: "Internal server error", signal: "red" });
    }
  }
);

// -------------------------ROUTE:2 to delete product (byID) -------------------------------------
router.delete("/deleteprod/:id", fetchAdmin, async (req, res) => {
  try {
    // first of all check whether this request is made by admin or not
    // fetching the id provided by fetchAdmin middleware
    const adminId = req.admin.id;

    // gethering the details of admin with provided id
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res
        .status(401)
        .json({ error: "Authentication fail please login", signal: "red" });
    }

    //finding product with provided id
    const prod = await Product.findById(req.params.id);
    if (!prod) {
      return res
        .status(400)
        .json({ error: "product with provided id not exist.", signal: "red" });
    }

    // admin autheticated and product exist in backend
    // so all safe now delete the product

    // first delete images 
      for(let imageName of prod.images){
        const imagePath = path.join(__dirname,'..', imageName);
        fs.unlinkSync(imagePath);
      }
    
    await Product.findByIdAndDelete(req.params.id);
    return res.json({ signal: "green" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ email: "Internal server error", signal: "red" });
  }
});

// -------------------------ROUTE:3 to update product -------------------------------------
router.put("/updateprod/:id",
fetchAdmin, 
upload.array('images'),
async (req, res) => {
  try {
    // first of all check whether this request is made by admin or not
    // fetching the id provided by fetchAdmin middleware
    const adminId = req.admin.id;

    // gethering the details of admin with provided id
    const admin = await Admin.findById(adminId);
    if (!admin) {
      // first delete uploaded images 
      if (req.files && req.files.length > 0) {
        for(let imageName of req.files){
          console.log(imageName);
          const imagePath = path.join(__dirname,'..', imageName);
          fs.unlinkSync(imagePath);
        }
      }

      return res
        .status(401)
        .json({ error: "Authentication fail please login", signal: "red" });
    }

    // find product to be update
    const findProd = await Product.findById(req.params.id);
    if (!findProd) {
      // first delete uploaded images 
      if (req.files && req.files.length > 0) {
        for(let image of req.files){
          const imagePath = path.join(__dirname,'..', image.path);
          fs.unlinkSync(imagePath);
        }
      }

      return res
        .status(400)
        .json({ error: "product not exist", signal: "red" });
    }

    // creating a temporory product to store parameters provided in request
    const {
      title,
      desc,
      company,
      dimension,
      weight,
      mrp,
      sellprice,
      category,
      sku,
      stock,
      soldstock,
    delImages} = req.body;
    const prod = {};

    if (title) {
      prod.title = title;
    }
    if (desc) {
      prod.desc = desc;
    }
    if (dimension) {
      prod.dimension = dimension;
    }
    if (mrp) {
      prod.mrp = mrp;
    }
    if (category) {
      prod.category = totrating;
    }
    if (company) {
      prod.company = company;
    }
    if (sellprice) {
      prod.sellprice = sellprice;
    }
    if (sku) {
      prod.sku = sku;
    }
    if (weight) {
      prod.weight = weight;
    }
    if (stock) {
      prod.stock = stock;
    }
    if (soldstock) {
      prod.soldstock = soldstock;
    }

    // Check if files were uploaded
    if (req.files && req.files.length > 0) {
      prod.images = req.files.map((file) => file.path);
    }
    
    // deleting images from backend
    if(delImages){
      for(let imageName of delImages){
        const imagePath = path.join(__dirname,'..', imageName);
        fs.unlinkSync(imagePath);
        findProd.images = findProd.images?.filter((img) => {return img !== imageName});
      }
    }

    // add remaining images of old product to new one 
    if(findProd.images){
      prod.images = findProd.images.concat(prod.images);
    }

    // now all safe to update the product
    const updatProd = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: prod },
      { new: true }
    );
    res.json({ product: updatProd, signal: "green" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ email: "Internal server error", signal: "red" });
  }
});

// -----------------------ROUT:4 fetch all the products -----------------.
router.post('/fetchallprods', async (req,res)=>{
    try {
    const prods = await Product.find();

    res.json(prods)
    } catch (error) {
    console.log(error);
    res.status(500).send("some error occured");
    }
})


// ------------------------ROUT:5 fetch limited data----------------------
router.post('/fetchlimitprods',
async(req,res)=>{

  try{
    // this are the parameters that will be provided in req
    const {page=1, pageSize=6, category='watch'} = req.query;
    const skip = (page-1)*pageSize;

    const prods = await Product.find({category:category})
    .skip(skip) //to skip the data that already fetched
    .limit(pageSize) // to send limited data
    .exec();

    res.json({products: prods, signal: "green"});
  }
  catch(e){
    console.log(e);
    res.status(500).send("some error occured");
  }
})


// ----------------------ROUT:6 fetch all but particular category products----------------
router.post('/fetchcategoryprods', 
async (req,res)=>{

  try {
    const {category= 'laptop'} = req.query;

    const prods = await Product.find({category: category})

    res.json(prods);
  } catch (e) {
    console.log(e);
    res.status(500).send("some error occured");
  }

})

module.exports = router;
