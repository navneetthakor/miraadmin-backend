// to connect with payment collection 
const Payment = require('../../models/Payment');

// to validate body parameter 
const {validationResult} = require('express-validator');

const updatePayment = async (req,res) =>{
    // if validation fils 
    const validError = validationResult(req);
    if(!validError.isEmpty()){
        // -----email admin------
        return res.status(400).json({error: validError.array(), signal: "red"});
    }


    
}

module.exports = updatePayment;