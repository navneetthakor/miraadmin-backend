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

// making upload/ folder public so that I can fetch that images
app.use("/public", express.static(path.join(__dirname, "public")));

// --------------------------- Routing setup -------------------------------
// importing routes files
const paymentRoutes = require("./routes/payments.js");
const adminRoutes = require("./routes/admin.js");
const productRoutes = require("./routes/products.js");
const customerRoutes = require("./routes/customer.js");
const cartRoutes = require("./routes/cart.js");
const ratingRoutes = require("./routes/ratings.js");
const orderRoutes = require("./routes/order.js");

// placing middlewares
app.use("/payment", paymentRoutes);
app.use("/admin", adminRoutes);
app.use("/product", productRoutes);
app.use("/customer", customerRoutes);
app.use("/cart", cartRoutes);
app.use("/rating", ratingRoutes);
app.use("/order", orderRoutes);

// temporory route for checkout session id creation
const stripe = require("stripe")(process.env.STRIPE_SECRET);
app.post("/chekoutCompleted", async(req,res)=>{
    // const {result} = req.body;
    console.log(req.body);
    return res.json({data: "ok"});
})
app.post("/checkoutSession", async (req, res) => {
  const { products } = req.body;

  const lineIteams = products?.map((prod) => {
    const imagePath = `http://localhost:5001/${prod.prod.images[0]}`.replace(
      /\\/g,
      "/"
    );
    return {
      price_data: {
        currency: "USD",
        product_data: {
          name: prod.prod.title,
          images: [imagePath],
        },
        // unit_amount:
        unit_amount: Math.round(prod.prod.sellprice * 100),
      },
      quantity: prod.ct,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineIteams,
    mode: "payment",
    success_url: "http://localhost:3000/Success",
    cancel_url: "http://localhost:3000/Cancel",
  });

  return res.json({ id: session.id });
});

// default routes

app.get("/", (req, res) => res.json({ signal: "green" }));

// -------------------------- Starting backend -----------------------------
app.listen(port, () => {
  console.log("backend is listening at port no : ", port);
});

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



// -------just for shipping purpose 
// shipping: {
//     name: "Random singh",
//     address: {
//       line1: "510 Townsend St",
//       postal_code: "98140",
//       city: "San Francisco",
//       state: "CA",
//       country: "US",
//     },
//   },