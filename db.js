// ---------- importing required modules ----------------
const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;

const connectToMongo = async() => {
    try{
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully");
    }
    catch(e){
        console.log(e);
    }
}

module.exports = connectToMongo;