const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

// @desc  Show all courses
// route  GET /api/v1/courses
// route  GET /api/v1/:bootcampId/courses
// access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const courses = await Course.find({ bootcamp: req.params.bootcampId });
		res.status(200).json({
			success: true,
			count: courses.length,
			data: courses,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});

// @desc  get course
// route  GET /api/v1/courses
// access Public

exports.getCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id).populate({
		path: "bootcamp",
		select: "name description",
	});

	if (!course) {
		return new ErrorResponse(`course not found id id ${req.params.id}`, 404);
	}

	res.status(200).json({
		success: true,
		data: course,
	});
});

// @desc  add a course
// route  GET /api/v1/:bootcamIp/courses
// access Private

exports.addCourse = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;
	req.body.user = req.user.id;
	const bootcamp = await Bootcamp.findById(req.params.bootcampId);

	if (!bootcamp) {
		return new ErrorResponse(
			`bootcamp not found with id of ${req.params.bootcampId}`,
			404
		);
	}

	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`user with id ${req.user.id} is not allowed to add a course to this bootcamp ${bootcamp._id}`
			),
			401
		);
	}

	const course = await Course.create(req.body);

	res.status(201).json({
		success: true,
		data: course,
	});
});

// @desc  update course
// route  PUT /api/v1/courses/:id
// access Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
	let course = await Course.findById(req.params.id);

	if (!course) {
		return next(
			new ErrorResponse(`course not found with id ${req.params.id}`, 404)
		);
	}

	if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`user with id ${req.user.id} is not allowed to aupdate course ${course._id}`
			),
			401
		);
	}

	course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: course,
	});
});

// @desc  delete course
// route  DELETE /api/v1/courses/:id
// access Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id);

	if (!course) {
		return next(
			new ErrorResponse(`course not found with id ${req.params.id}`, 404)
		);
	}

	if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`user with id ${req.user.id} is not allowed to delete course ${course._id}`
			),
			401
		);
	}

	await Course.findByIdAndRemove(req.params.id);

	res.status(200).json({
		success: true,
		data: {},
	});
});
