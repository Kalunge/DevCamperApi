const express = require("express");
const {
	getBootcamp,
	getBootcamps,
	updateBootcamp,
	createBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
	bootcampPhotoUpload,
} = require("../controllers/bootcamp");

const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResults");
const { protect, authrize } = require("../middleware/auth");

// INCLUDE OTHER RESOURCES ROUTES
const courseRouter = require("./courses");

const router = express.Router();

// Reroute
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router
	.route("/:id/photo")
	.put(protect, authrize("publisher", "admin"), bootcampPhotoUpload);

router
	.route("/")
	.get(advancedResults(Bootcamp, "courses"), getBootcamps)
	.post(protect, authrize("publisher", "admin"), createBootcamp);
router
	.route("/:id")
	.get(getBootcamp)
	.put(protect, authrize("publisher", "admin"), updateBootcamp)
	.delete(protect, authrize("publisher", "admin"), deleteBootcamp);

module.exports = router;
