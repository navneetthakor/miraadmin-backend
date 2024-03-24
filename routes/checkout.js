// importing express 
const express = require('express');
const router = express.Router();

// importing stripe module
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// to create order
const axios = require("axios");

router.post("/", async (req, res) => {
  const { products } = req.body;
  let session;
  if (req.body.method !== "cod") {
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
          unit_amount: Math.round((prod.prod.sellprice * 100) / 83),
        },
        quantity: prod.ct,
      };
    });

    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineIteams,
      mode: "payment",
      success_url: "http://localhost:3000/Success",
      cancel_url: "http://localhost:3000/Cancel",
    });
  }


  //  ----------- creating order----------
//   formating product array 
const prod = products?.map((prod) => {
    return({
        product_Id: prod.prod._id,
        quantity: prod.ct
    })
})
  try {
    const url = "http://localhost:5001/order/order";
    const data = {
      products: prod,
      method: req.body.method,
      address: req.body.address,
      session_id: req.body.method === "cod" ? "" : session.id,
      country: req.body.address.country,
      amount: req.body.amount,
      mobile: req.body.mobile,
      email: req.body.email
    };
    const headers = {
        "custmrtoken": req.header("custmrtoken"),
    }
    const response = await axios.post(url, data, {headers});
    const resData = response.data;

  } catch (e) {
    console.log(e);
    // -----email---to admin---
    return res.status(500).json({error: "error occure while creating order", signal: "red"});
  }

  return res.json({
    id: req.body.method === "cod" ? "" : session.id,
    signal: "green",
  });
});

module.exports = router;
