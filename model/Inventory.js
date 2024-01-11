const mongoose = require("mongoose");
const { Schema, model} = mongoose;

const InventorySchema = new Schema({
    product_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})

module.exports = model("Inventory", InventorySchema);


// inventorys = {
//     productId,
//     inventory,
// }