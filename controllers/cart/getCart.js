// to connect with collection 
const Cart = require('../../models/Cart');
const Customer = require('../../models/Customer');

// to validate parameters provided in body 
const {validationResult} = require('express-validator');

const getCart = async(req,res) =>{
    try{

        // check whether all parameters are appropriate in body or not 
        const validError = validationResult(req);
        if(!validError.isEmpty()){
            return res.status(401).json({error: validError.array(), signal: "red"});
        }
        
        // now check whether custmr exists or not 
        const custmr = await Customer.findById(req.body.customer_id);
        if(!custmr){
            return res.status(401).json({error: "user doesn't exists", signal: "red"});
        }
        
        // now all set to return cart 
        const cart = await Cart.findOne({customer_id: req.body.customer_id});
        
        return res.json({cart: cart, signal: "green"});
    }
    catch(e){
        console.log(e);
        return res.status(500).json({error: "Interner server Error", signal: "red"});
    }
}

module.exports = getCart;