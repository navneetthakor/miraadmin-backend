// to connect with Cart collection 
const { default: mongoose } = require('mongoose');
const Cart = require('../../models/Cart');
const Customer = require('../../models/Customer');

// to check parameters provided in body 
const {validationResult} = require('express-validator');

const deleteToCart = async(req,res) =>{
    try{
        // check whether body is appropriate or not 
        const validErro = validationResult(req);
        if(!validErro.isEmpty()){
            return res.status(401).json({error: validErro.array(), signal: "red"});
        }

        // check whether customer exists or not 
        const custmr = await Customer.findById(req.body.customer_id);
        if(!custmr){
            return res.status(401).json({message: "customer not exists", signal: "red"});
        }

        // now customer exists so it's safe to delete listed iteam 
        // fist find cart 
        const cart = await Cart.find({customer_id: req.body.customer_id});

        // filter cart 
        const filteredCart = cart[0].cart_prods?.filter((iteam) => {
            return iteam.product_id.toString() !==  req.body.product_id;
        })
        
        // finally update cart s
        const newCart = await Cart.findByIdAndUpdate(
            cart[0]._id,
            {$set: {cart_prods: filteredCart}},
            {new : true}
        )

        // now return updated cart 
        return res.json({cart: newCart, signal: "green"});

    }catch(e){
        console.log(e);
        return res.status(500).json({message: "Internel server Error", signal: "red"});
    }
}

module.exports = deleteToCart;