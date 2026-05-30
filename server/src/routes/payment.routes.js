const router = require("express").Router();
const auth   = require("../middlewares/auth");
const c      = require("../controllers/payment.controller");

router.post("/create-order",  auth, c.createOrder);
router.post("/verify",        auth, c.verifyPayment);

module.exports = router;
