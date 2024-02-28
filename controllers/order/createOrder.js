// to connect with collections 
const Order = require('../../models/Order');
const Customer = require('../../models/Customer');

// to validate body parameters
const {validationResult} = require('express-validator');

// to call payment endpoint 
const axios = require('axios');

const createOrder = async (req,res,) => {
    try{

        // varify body parameters 
        const validError = validationResult(req);
        if(!validError.isEmpty()){
            return res.status(400).json({error: validError.array(), signal: "red"});
        }
        
        // check whether customer exists or not 
        const custmr = await Customer.findById(req.body.customer_id);
        if(!custmr){
            return res.status(400).json({error: "customer not exists", signal: "red"});
        }
        
        // creating payment
        const url = 'http://localhost:5001/payment/createPayment';
        const data = {
            customer_id : req.body.customer_id,
            method: req.body.method,
            paymentIntentObj: req.body.paymentIntentObj ? req.body.paymentIntentObj : "",
            country: req.body.address.country,
            amount: req.body.amount
        }
        const response = await axios.post(url,data);
        const payment = response.data;
        
        // if something goes rong in payment route 
        if(payment.signal === "red"){
            console.log(payment);
            //---email to admin---
            return res.status(400).json({error: "error occure during creating payment", signal: "red"});
        }
        
        // now create order 
        const order = new Order({
            customer_id: req.body.customer_id,
            products : req.body.products,
            address: req.body.address,
            payment_id: payment.payment._id
        })
        order.save();

        // update payment 
        const url2 = 'http://localhost:5001/payment/updatePayment';
        const data2 ={
            payment_id: payment.payment._id,
            order_id: order._id
        }
        const response2 = await axios.put(url2, data2)
        const payment2 = response2.data;
        
        // if something goes rong in payment route 
        if(payment2.payment.signal === "red"){
            //---email to admin---
            return res.status(400).json({error: "error occure during updating payment", signal: "red"});
        }
        
        // ---email to admin ---
        // ---email to customer---
        return res.json({order: order, signal: "green"});
    }catch(e){
        console.log(e);
        //---email to admin--
        return res.status(500).json({error: "internal server error", signal: "red"});
    }
}

module.exports = createOrder;