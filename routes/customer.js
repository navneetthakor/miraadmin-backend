// to use the express 
const express = require('express');
const router = express.Router();

// to validate the given parameter in request 
const {body, validationResult } = require('express-validator');

// to get connectivity with collection of custmr in database
// it is model which we created previously 
const Customer = require('../models/Customer');

// to provide authtoken (for digital signature) 
const jwt = require('jsonwebtoken');

// to encrypt the password 
const bcrypt = require('bcryptjs');

//fetchCustomer middleware to fetch data from auth-token
const fetchCustomer = require('../middlewares/fetchCustomer');
const fetchAdmin = require('../middlewares/fetchAdmin');

// to use admin modal 
const Admin = require('../models/Admin');

// to upload images 
const upload = require('../middlewares/fetchImages');

// to delete image 
const fs = require('fs');

// --------------------------ROUTE:1 create custmr account ----------------------------------------------------------
router.post('/createcustmr',
upload.single('image'),
[
    body("name", "please enter name").not().isEmpty(),
    body("email", "please enter valid email").isEmail(),
    body("password", "please enter password with minimum length of : 6").isLength({min:6})
],
async (req,res)=>{
    try{

    // checking the given parameters 
    const err =  validationResult(req);
    if(!err.isEmpty()){
        return res.status(400).json({error: err.array(), signal: "red"})
    }

    // check wheteher any custmr exists with provided email or not 
    let custmr = await Customer.findOne({email: req.body.email});
    if(custmr){
        return res.status(400).json({error: "custmr with given email already exists", signal: "red"});
    }

    // encrypt the password using bcrypt
    const salt = await bcrypt.genSaltSync(10);
    const securePas = await bcrypt.hashSync(req.body.password, salt);

    // creating and saving custmr in backend 
    const temp = new Customer({
        image: req.file ? req.file.path : "",
        name: req.body.name,
        email: req.body.email,
        password: securePas,
        mobile: req.mobile? req.mobile : ""
    })
    temp.save();

    // jsonwebtoken related 
    // to provide authentication token back to custmr 
    const data = {
        custmr: {
            id: temp.id,
        }
    }
    const jwt_secret = "tonystarkismyrolemodel";
    const custmrtoken = jwt.sign(data,jwt_secret);
    return res.json({custmrtoken: custmrtoken, signal: "green"});

    }catch(e){
        console.log(e);

        // delete uploaded file 
        if(req.file) fs.unlinkSync(req.file.path);
        
        res.status(500).json({email: "some error occured", signal: 'red'});
    }
})


// --------------------------ROUTE:2 login to account (previous login not require) ----------------------------------------------------------
router.post('/login',
[
    body("email", "please enter valid email").isEmail(),
    body("password", "please do enter your password").not().isEmpty()
],
async (req,res)=>{
    try{
    // check validation of parameters provided body 
    const err = validationResult(req);
    if(!err.isEmpty()){
        return res.status(400).json({error: err.array(), signal: "red"});
    }

    // check wheter any custmr exists with given email or not 
    const custmr = await Customer.findOne({email: req.body.email});
    if(!custmr){
        return res.status(400).json({error: "enter valid credentials", signal: "red"});
    }

    // check whether the password provided is correct or not 
    const passCompare = await bcrypt.compare(req.body.password, custmr.password);
    if(!passCompare){
        return res.status(400).json({error: "enter valid credentials", signal: "red"});
    }

    // we reach here means all details are correct 
    // so prepare authtoken to provide it back 
    const data = {
        custmr: {
            id: custmr.id
        }
    }
    const jwt_secret = "tonystarkismyrolemodel";
    const authtoken = jwt.sign(data,jwt_secret);
    res.json({authtoken: authtoken, signal: "green"});

    } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal Server Error", signal: "red"}); 
    }
})


// --------------------------ROUTE:3 login to accoutn with authtoken ( previous login not require) ----------------------------------------------------------
router.post('/getcustmr', fetchCustomer ,async (req,res)=>{

    try {

        // fetching the id provided by fetchCustomer middleware 
        custmrId = req.custmr.id;

        // gethering the details of custmr with provided id 
        const custmr = await Customer.findById(custmrId).select("-password");
        if(!custmr){
           return res.status(401).json({error: "Authentication fail please login", signal: 'red'});
        }
        return res.json({custmr:custmr, signal: 'green'});

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal Server Error", signal: "red"}); 
    }
 })


//  --------------------------Route:4 to update profile (login required) --------------------------
router.put('/updatecustmr',
fetchCustomer,
upload.single('image'),
async (req,res) => {
    try{

        // find id of custmr
        const custmrId = req.custmr.id;
        
        // find customer 
        const custmr = await Customer.findById(custmrId);
        if(!custmr){
            res.status(401).json({message: "Please login with valid credentials", signal: "red"});
        }
        
        // now customer exists
        // get all the fields which are suppose to update 
        const {name, mobile} = req.query;
        
        // create object to hold values 
        const newCustmr = {
            image: req.file ? req.file.path : custmr.image,
            name: name ? name : custmr.name,
            mobile: mobile ? mobile : custmr.mobile
        };
        
        // delete old image if new image is being provided 
        if(req.file && custmr.image!=="") fs.unlinkSync(custmr.image);
        
        // now update profile 
        const updtCustmr = await Customer.findByIdAndUpdate(
            custmrId,
            {$set : newCustmr},
            {new :  true}
        )
            
        // return updated profile 
        res.json({custmr: updtCustmr, signal:"green"});
    }
    catch(e){
        console.log(e);

        // delete uploaded image 
        if(req.file) fs.unlinkSync(req.file.path);

        res.status(500).json({message: "internal error occured", signal: "red"});
    }
})

//  ----------------------------- Route:5 fetchall Customers (only for admin) ---------------
router.post('/getallcustomers',fetchAdmin ,async (req,res)=>{

    try{
        // extracting admin-id privided by fetchAdmin 
        const adminId = req.admin.id;
    
        // check whether such admin exsists or not 
        const admin = await Admin.findById(adminId);
        if(!admin) res.status(400).json({message: "You are not admin", signal: "red"});
    
        // now fetch all customers and send them to front-end 
        const customers = await Customer.find();
        res.json(customers);
        // res.json({customers: customers, signal: "green"});
    }
    catch(e){
        console.log(e);
        res.status(500).json({message: "internal server error", signal: "red"});
    }
})


module.exports = router;