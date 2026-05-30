const router = require("express").Router();
const auth   = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const c      = require("../controllers/auth.controller");

router.post("/signup",  c.signup);
router.post("/login",   c.login);
router.get("/me",       auth, c.getMe);
router.patch("/profile", auth, upload.single("avatar"), c.updateProfile);
router.patch("/me",      auth, c.updateProfile);

module.exports = router;
