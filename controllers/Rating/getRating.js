// to connect with collections 
const Rating = require('../../models/Rating');

// to check body parameters 
const {validationResult} = require('express-validator');

const getRating = async(req,res) => {

    try{

        // check whether appropriate parameters are provided in body or not 
        const validError = validationResult(req);
        if(!validError.isEmpty()){
            return res.status(401).json({error: validError.array(), signal: "red"});
        }
        
        // fetch rating document 
        const rating = await Rating.findOne({product_id: req.body.product_id});
        
        // if rating not found 
        if(!rating){
            return res.status(400).json({error:"product not exists", signal: "red"});
        }
        
        return res.json({rating:rating, signal: "green"});
    }
    catch(e){
        console.log(e);
        return res.status(500).json({error: "internel server error", signal: "red"});
    }
}

module.exports = getRating;