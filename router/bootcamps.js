const express = require("express");
const {
	getBootcamp,
	getBootcamps,
	updateBootcamp,
	createBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
} = require("../controllers/bootcamp");

// INCLUDE OTHER RESOURCES ROUTES
const courseRouter = require("./courses");

const router = express.Router();

// Reroute
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/").get(getBootcamps).post(createBootcamp);
router
	.route("/:id")
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
