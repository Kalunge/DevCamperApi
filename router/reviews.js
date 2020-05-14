const express = require("express");
const {
	getReviews,
	getReview,
	addReview,
	updateReview,
	deleteReview,
} = require("../controllers/reviews");
const { protect, authrize } = require("../middleware/auth");

const Review = require("../models/Review");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

router
	.route("/")
	.get(
		advancedResults(Review, {
			path: "bootcamp",
			select: "name description",
		}),
		getReviews
	)
	.post(protect, authrize("user", "admin"), addReview);
router
	.route("/:id")
	.get(getReview)
	.put(protect, authrize("user", "admin"), updateReview)
	.delete(protect, authrize("user", "admin"), deleteReview);

module.exports = router;
