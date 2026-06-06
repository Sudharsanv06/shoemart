const router = require("express").Router();
const c      = require("../controllers/chat.controller");

// Public route — no auth needed for chatbot
router.post("/", c.chat);

module.exports = router;