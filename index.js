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
const cartRoutes = require("./routes/cart.js");
const ratingRoutes = require('./routes/ratings.js');
const orderRoutes = require("./routes/order.js");

// placing middlewares 
app.use('/payment', paymentRoutes);
app.use('/admin',adminRoutes);
app.use('/product',productRoutes);
app.use('/customer',customerRoutes);
app.use('/cart',cartRoutes);
app.use('/rating',ratingRoutes);
app.use('/order', orderRoutes);


// default routes 
app.get('/', (req,res) => res.json({"signal": "green"}));



// -------------------------- Starting backend -----------------------------
app.listen(port, () => {
    console.log("backend is listening at port no : ",port);
})


// backend completed on --(29/02/2024)-- (12:14 PM)--
// still there are sum bugs in product routes 
// 1. while tring to delete rating from product route using axios it gives error 
//   -> for now i had directly introduced Rating collection in that route 
// 2. while updating product it adds null to image array if image is not provided 

// ------ still some task left -------
// 1.email introduction left
// 2.stripe part left
// 3. password update 
// 4. admin profile update 