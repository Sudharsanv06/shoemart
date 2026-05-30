const Razorpay   = require("razorpay");
const crypto     = require("crypto");
const ApiResponse = require("../utils/ApiResponse");
const ApiError    = require("../utils/ApiError");

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Step 1: Create Razorpay order
exports.createOrder = async (req, res, next) => {
  try {
    const { amount } = req.body; // amount in rupees
    if (!amount) throw new ApiError(400, "Amount required");

    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt:  `receipt_${Date.now()}`,
    });

    res.json(new ApiResponse(200, {
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
    }));
  } catch (e) { next(e); }
};

// Step 2: Verify payment signature after success
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature)
      throw new ApiError(400, "Payment verification failed");

    res.json(new ApiResponse(200, {
      verified: true,
      paymentId: razorpay_payment_id,
      orderId:   razorpay_order_id,
    }, "Payment verified"));
  } catch (e) { next(e); }
};
