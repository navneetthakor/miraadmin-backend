// to connect with payment collection 
const Admin = require('../../models/Admin');
const Payment = require('../../models/Payment');

// to validate body parameter 
const {validationResult} = require('express-validator');

const updatePayment = async (req,res) =>{
    try{

        // if validation fils 
        const validError = validationResult(req);
        if(!validError.isEmpty()){
            // -----email admin------
            return res.status(400).json({error: validError.array(), signal: "red"});
        }
        
        // check wheter admin exists or not 
        const adminId = req.admin.id;
        const admin = await Admin.findById(adminId);
        if(!admin){
            return res(401).json({error: "please enter valid credentials", signal: "red"})
        }
        // destructure fields sent in body of request 
        const {order_id, paymentIntentObject, payment_id} = req.body;
        const newPayment = {}
        
        if(order_id) newPayment.order_id = order_id;
        if(paymentIntentObject){
            newPayment.payment_intent_id = paymentIntentObject.id,
            newPayment.status = "completed"
        }
        
        // update data in backend 
        const ans = await Payment.findByIdAndUpdate(
            payment_id,
            {$set: newPayment},
            {new: true}
            );
            
            return res.json({payment: ans, signal: "green"});
        }catch(e){
            console.log(e);
            return res.status(500).json({error: "internla server error", signal: "red"});
        }   
}

module.exports = updatePayment;