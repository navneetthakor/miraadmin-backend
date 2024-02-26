// to connect with collection 
const { check } = require('express-validator');
const Payment = require('../../models/Payment');

// to check parameters provided in body 
const {validationResult} = require('express-validator');

const createPayment = async(req,res) => {
    try{

        // check whether parameters are appropriate or not in body 
        const validError = validationResult(req);
        if(!validError.isEmpty()){
            return res.status(400).json({error: validError.array(), signal: "red"});
        }
        
        // we are not checking for the customer because that is already done in Order.js and then request is created to 
        // add payment details 
        
        // if payment method is cash on delivery then 
        if(req.body.method === "cod"){
            const payDetails = new Payment({
                customer_id: req.body.customer_id,
                amount: req.body.amount,
                method: "cod",
                status: "pending",
                country: req.body.country
            })
            
            payDetails.save();
            return res.json({payment: payDetails, signal: "green"});
        }
        
        // else if payment is made thorough strip then 
        const payDetails = new Payment({
            customer_id: req.body.customer_id,
            amount: req.body.amount,
            payment_intent_id: req.body.paymentIntentObj.id,
            method: req.body.paymentIntentObj.payment_method_details.type,
            status: "completd",
            country: req.body.country
        })
        
        payDetails.save();
        return res.json({payment: payDetails, signal: "green"});
    }catch(e){
        console.log(e);
        return res.status(500).json({error: "Internal server error", signal: "red"});
    }
}

module.exports = createPayment;