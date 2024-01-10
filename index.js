// ------------------ to connect with mongoDB -----------------------------
const connectToMongo = require("./db.js");
connectToMongo();


// ------------------ dotenv setup ----------------------------------------
const setupDotEnv = require("./setupenv.js");
setupDotEnv();

//------------------------- importing required modules----------------------
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 5001;


// --------------------------- Middleware setup ----------------------------
// to enable cross origin resource sharing 
app.use(cors());

// to parse the body of request (specifically for post requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --------------------------- Routing setup -------------------------------
app.get('/',(req,res)=> res.json({"signal": "green"}));


// -------------------------- Starting backend -----------------------------
app.listen(port, () => {
    console.log("backend is listening at port no : ",port);
})
