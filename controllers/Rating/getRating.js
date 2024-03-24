// to connect with collections 
const Customer = require('../../models/Customer');
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
        let tempRating = [];

        for(i in rating.review){
            const custmr = await Customer.findById(rating.review[i].customer_id);
            const temp = {
                name: custmr.name,
                rate: rating.review[i].rate,
                customer_id: rating.review[i].customer_id,
                desc: rating.review[i].desc,
            }
            tempRating.push(temp);
        }
        
        return res.json({rating:tempRating, signal: "green"});
    }
    catch(e){
        console.log(e);
        return res.status(500).json({error: "internel server error", signal: "red"});
    }
}

module.exports = getRating;