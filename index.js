// ------------------ dotenv setup (to use environment variables) ---------
const setupDotEnv = require("./setupenv.js");
setupDotEnv();


// ------------------ to connect with mongoDB -----------------------------
const connectToMongo = require("./db.js");
connectToMongo();


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
// importing routes files 
const paymentRoutes = require("./routes/payments.js");
const adminRoutes = require("./routes/admin.js");
const productRoutes = require("./routes/products.js");
const customerRoutes = require("./routes/customer.js");

// placing middlewares 
app.use('/payments', paymentRoutes);
app.use('/admin',adminRoutes);
app.use('/product',productRoutes);
app.use('/customer',customerRoutes);

// default routes 
app.get('/', (req,res) => res.json({"signal": "green"}));



// -------------------------- Starting backend -----------------------------
app.listen(port, () => {
    console.log("backend is listening at port no : ",port);
})
