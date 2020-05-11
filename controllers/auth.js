const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc  Register User
// route  POST /api/v1/auth/register
// access Public

exports.register = asyncHandler(async (req, res, next) => {
	const { email, password, role, name } = req.body;

	//Add user
	const user = await User.create({
		email,
		name,
		email,
		password,
		role,
	});
	sendTokenResponse(user, 200, res);
});

// @desc  login User
// route  POST /api/v1/auth/login
// access Public

exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// Validate Email and Password
	if (!email || !password) {
		return next(
			new ErrorResponse(`Please provide an email and a password`),
			400
		);
	}
	// Check for user
	const user = await User.findOne({ email }).select("+password");
	if (!user) {
		return next(new ErrorResponse(`invalid credentials`), 401);
	}
	// ceck password match
	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
		return next(new ErrorResponse(`invalid credentials`), 401);
	}

	sendTokenResponse(user, 200, res);
});

// Get token from model create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
	// Create Token
	const token = user.getSignedJwtToken();

	options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === "productions") {
		options.secure = true;
	}

	res.status(statusCode).cookie("token", token, options).json({
		success: true,
		token,
	});
};

// @desc  Get current loggedin User
// route  POST /api/v1/auth/Me
// access Private

exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		data: user,
	});
});
