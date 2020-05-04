// @desc  Show all bootcamps
// route  GET /api/v1/bootcamps
// access Public
exports.getBootcamps = (req, res, next) => {
	res.status(200).json({ success: true, message: "Show all bootcamps" });
};

// @desc  Show bootcamp
// route  GET /api/v1/bootcamps/:id
// access Public
exports.getBootcamp = (req, res, next) => {
	res
		.status(200)
		.json({ success: true, message: `Get bootcamp of id ${req.params.id}` });
};

// @desc  create bootcamp
// route  POST /api/v1/bootcamps
// access Private
exports.createBootcamp = (req, res, next) => {
	res.status(200).json({ success: true, message: "Add a new bootcamp" });
};

// @desc  update bootcamp
// route  PUT /api/v1/bootcamps/:id
// access Private
exports.updateBootcamp = (req, res, next) => {
	res
		.status(200)
		.json({ success: true, message: `update bootcamp of id ${req.params.id}` });
};

// @desc  Delete bootcamp
// route  DELETE /api/v1/bootcamps/:id
// access Private
exports.deleteBootcamp = (req, res, next) => {
	res
		.status(200)
		.json({ success: true, message: `Delete bootcamp of id ${req.params.id}` });
};
