const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");

// @desc  Show all bootcamps
// route  GET /api/v1/bootcamps
// access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

// @desc  Show bootcamp
// route  GET /api/v1/bootcamps/:id
// access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found wit id ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: bootcamp });
});

// @desc  create bootcamp
// route  POST /api/v1/bootcamps
// access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	req.body.user = req.user.id;

	const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
	if (publishedBootcamp && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`the user with id ${req.user.id} Has already published a bootcamp`
			),
			400
		);
	}

	bootcamp = await Bootcamp.create(req.body);
	res.status(201).json({ success: true, data: bootcamp });
});

// @desc  update bootcamp
// route  PUT /api/v1/bootcamps/:id
// access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	let bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found wit id ${req.params.id}`, 404)
		);
	}

	// check bootcamp ownership
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`user with id ${req.params.id} is not allowed to update this bootcamp`,
				404
			)
		);
	}

	bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({ success: true, data: bootcamp });
});

// @desc  Delete bootcamp
// route  DELETE /api/v1/bootcamps/:id
// access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found wit id ${req.params.id}`, 404)
		);
	}

	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`user with id ${req.params.id} is not allowed to delete this bootcamp`
			),
			401
		);
	}

	bootcamp.remove();
	res.status(200).json({ success: true, data: {} });
});

// @desc  Get Bootcamps within radius
// route  GET /api/v1/bootcamps/radius/:zipcode/:distance
// access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Get Long and Lat
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// calculate radius in radians by dividing distance by Earths radius(3963 m or 6378 km)
	const radius = distance / 3963;
	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});
	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
});

// @desc  upload photo for bootcamp
// route  PUT /api/v1/bootcamps/:id/photo
// access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found wit id ${req.params.id}`, 404)
		);
	}

	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`user with id ${req.params.id} is not allowed to delete this bootcamp`
			),
			401
		);
	}

	if (!req.files) {
		return next(new ErrorResponse("Please upload a photo", 400));
	}

	const file = req.files.File;
	// Make sure image is a photo
	if (!file.mimetype.startsWith("image")) {
		return next(new ErrorResponse("Please upload an mage file", 400));
	}

	// Check file size
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(
			new ErrorResponse(
				`Please upload an mage of size less than ${process.env.MAX_FILE_UPLOAD}`,
				400
			)
		);
	}

	// create custom photo name
	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.error(err);
			return next(new ErrorResponse(`problem with uploading file`, 500));
		}

		await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
		res.status(200).json({
			success: true,
			data: file.name,
		});
	});
});
