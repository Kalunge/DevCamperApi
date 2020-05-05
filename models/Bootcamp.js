const mongoose = require("mongoose");
const slugify = require("slugify");

const BootcampSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "name is required"],
		unique: true,
		trim: true,
		maxlength: [50, "name cannot be longer than 50 characters"],
	},
	slug: String,
	description: {
		type: String,
		required: [true, "please add a description for your bootcamp"],
		maxlength: [500, "Description cannot exceed 500 characters"],
	},
	website: {
		type: String,
		match: [
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			"Please add a valid website with http or https",
		],
	},
	email: {
		type: String,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			"Please add a valid email",
		],
	},
	address: {
		type: String,
		required: [true, "please add a valid adress"],
	},
	// location: {
	// 	// GeoJson
	// 	type: {
	// 		type: String,
	// 		enum: ["Point"],
	// 		required: true,
	// 	},
	// 	coordinates: {
	// 		type: [Number],
	// 		required: true,
	// 		index: "2dsphere",
	// 	},
	// 	formattedAdress: String,
	// 	street: String,
	// 	city: String,
	// 	state: String,
	// 	zipCode: String,
	// 	country: String,
	// },
	careers: {
		// Array of strings
		type: [String],
		required: true,
		enum: [
			"Web Development",
			"Mobile Development",
			"UI/UX",
			"Data Science",
			"Business",
			"Other",
		],
	},
	averageRating: {
		type: Number,
		min: [1, "Rating must be at least 1"],
		max: [10, "Rating must can not be more than 10"],
	},
	averageCost: Number,
	photo: {
		type: String,
		default: "no-photo.jpg",
	},
	housing: {
		type: Boolean,
		default: false,
	},
	jobAssistance: {
		type: Boolean,
		default: false,
	},
	jobGuarantee: {
		type: Boolean,
		default: false,
	},
	acceptGi: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

BootcampSchema.pre("save", function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
