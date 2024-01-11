const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const OrderSchema = new Schema({
    product_ids: [
        {
            type: mongoose.Types.ObjectId,
            required: true
        }
    ],
    customer_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    payment_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city:{
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        }
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

module.exports = model("Order", OrderSchema);

// orders = {
//     prodcutIds : ["array of products with quantity"],
//     userId,
//     address,
//     paymentId,
//     status,
//     date,
// }