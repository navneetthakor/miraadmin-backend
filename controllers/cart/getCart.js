// to connect with collection 
const Cart = require('../../models/Cart');
const Customer = require('../../models/Customer');

const getCart = async(req,res) =>{
    try{
        // check whether id got or not 
        if(req.custmr.id === undefined || req.custmr.id === null) {
            return res.status(401).json({error: "custmrtoken is not available, please login again" , signal: "red"});
        }
        
        // now check whether custmr exists or not 
        const custmr = await Customer.findById(req.custmr.id);
        if(!custmr){
            return res.status(401).json({error: "user doesn't exists", signal: "red"});
        }
        
        // now all set to return cart 
        const cart = await Cart.findOne({customer_id: req.custmr.id});
        
        return res.json({cart: cart, signal: "green"});
    }
    catch(e){
        console.log(e);
        return res.status(500).json({error: "Interner server Error", signal: "red"});
    }
}

module.exports = getCart;