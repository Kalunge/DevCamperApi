const express = require("express");
const {
	register,
	login,
	getMe,
	forgotPassowrd,
	resetPassowrd,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgotpassword", forgotPassowrd);
router.put("/resetpassword/:resettoken", resetPassowrd);

module.exports = router;
