const express = require("express");
const {
	getCourses,
	getCourse,
	addCourse,
	updateCourse,
	deleteCourse,
} = require("../controllers/course");
const { protect, authrize } = require("../middleware/auth");

const course = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

router
	.route("/")
	.get(
		advancedResults(course, {
			path: "bootcamp",
			select: "name description",
		}),
		getCourses
	)
	.post(protect, authrize("publisher", "admin"), addCourse);
router
	.route("/:id")
	.get(getCourse)
	.put(protect, authrize("publisher", "admin"), updateCourse)
	.delete(protect, authrize("publisher", "admin"), deleteCourse);

module.exports = router;
