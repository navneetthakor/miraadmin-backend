const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PaymentSchema = new Schema({
    order_id: {
        type: mongoose.Types.ObjectId,
        // first payment will be perform so at that moment orderf_id will not be available
        // once order is confirm will provide a way to add order_id  
        // required: true
    },
    customer_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    tot_payment: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    month: { //month component is left
        type: Number,
        required: true,
        default: Date().getMonth() + 1
    },
    year: {
        type: Number,
        required: true,
        default: Date().getFullYear()
    }
})

module.exports = model("Payment", PaymentSchema);

// payments = {
//     orderId,
//     userId,
//     payments,
//     date,
//     month,
//     year
// }