const express = require("express");
const {
	getUsers,
	getUser,
	updateUser,
	deleteUser,
	createUser,
} = require("../controllers/users");

const User = require("../models/User");

const { protect, authrize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(authrize("admin"));
router.route("/").get(advancedResults(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
