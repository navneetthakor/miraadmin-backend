const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ProductSchema = new Schema({
  images: [
    {
      type: String,
      required: true,
    },
  ],
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    require: true,
  },
  modal: {
    type: String,
    require: true,
  },
  height: {
    type: String,
    require: true,
  },
  width: {
    type: String,
    require: true,
  },

  dummyPrice: {
    type: Number,
  },
  price: {
    type: Number,
    require: true,
  },
  color:[
    {
        type: String,
        required: true
    }
  ],
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = model("Products", ProductSchema);

// products = {
//     images,
//     name,
//     desc,
//     height,
//     width,
//     dummyPrice,
//     price,
//     color,
//     category,
//     date,
// }
