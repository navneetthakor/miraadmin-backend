// to connect with payment collection
const Payment = require("../../models/Payment");


const updatePayment = async (req, res) => {
  try {

    // destructuring request body
    const { order_id, session_id, payment_id } = req.body;
    const newPayment = {};

    if (order_id) { //to add order id in payment document
      newPayment.order_id = order_id;

      const ans = await Payment.findByIdAndUpdate(
        payment_id,
        { $set: newPayment },
        { new: true }
      );

      return res.json({ payment: ans, signal: "green" });
    } else if (payment_id) { //to mark cod payment as completed
      newPayment.status = "Completed";
      const ans = await Payment.findByIdAndUpdate(
        payment_id,
        { $set: newPayment },
        { new: true }
      );

      return res.json({ payment: ans, signal: "green" });
    }
    
    // if code reaches here that means that payment made throud stripe and it's completed now 
      newPayment.session_id = session_id;
      newPayment.status = "completed";

      const ans = await Payment.findOneAndUpdate(
        {session_id: session_id},
        { $set: newPayment },
        { new: true }
      );

      return res.json({ payment: ans, signal: "green" });

  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ error: "internal server error", signal: "red" });
  }
};

module.exports = updatePayment;
