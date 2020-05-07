const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");

// @desc  Show all bootcamps
// route  GET /api/v1/bootcamps
// access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	let query;

	// COPY REQ . QUERY
	let reqQuery = { ...req.query };

	// exclude fields
	const removeFields = ["select", "sort"];

	// loop over remove fields and exclude them from reqQuery
	removeFields.forEach((param) => delete reqQuery[param]);
	console.log(reqQuery);

	// create query
	let queryStr = JSON.stringify(reqQuery);

	// create query operators
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	// finding Resource
	query = Bootcamp.find(JSON.parse(queryStr));

	// select fields
	if (req.query.select) {
		const fields = req.query.select.split(",").join(" ");
		query = query.select(fields);
	}

	// build sort query
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		query = query.sort(sortBy);
	} else {
		query = query.sort("-createdAt");
	}

	// EXECUTING QUERY
	const bootcamps = await query;
	res
		.status(200)
		.json({ success: true, count: bootcamps.length, data: bootcamps });
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
	bootcamp = await Bootcamp.create(req.body);
	res.status(201).json({ success: true, data: bootcamp });
});

// @desc  update bootcamp
// route  PUT /api/v1/bootcamps/:id
// access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found wit id ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: bootcamp });
});

// @desc  Delete bootcamp
// route  DELETE /api/v1/bootcamps/:id
// access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found wit id ${req.params.id}`, 404)
		);
	}
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
