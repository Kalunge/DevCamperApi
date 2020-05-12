const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, "PLease add a name"],
	},
	description: {
		type: String,
		required: [true, "PLease add a description"],
	},
	weeks: {
		type: String,
		required: [true, "Please add a number of weeks"],
	},
	tuition: {
		type: Number,
		required: [true, "Please add a tution fees"],
	},
	minimumSkill: {
		type: String,
		required: [true, "Please add a minimum skill"],
		enum: ["beginner", "intermediate", "advanced"],
	},
	scholarshipAvailable: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		ref: "Bootcamp",
		required: true,
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
});

// statice method to find average cost of tuition
CourseSchema.statics.getAverage = async function (bootcampId) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId },
		},
		{
			$group: {
				_id: "$bootcamp",
				averageCost: { $avg: "$tuition" },
			},
		},
	]);
	try {
		await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
			averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
		});
	} catch (err) {
		console.error(err);
	}
};

// CALL calculate average after save
CourseSchema.post("save", function (next) {
	this.constructor.getAverage(this.bootcamp);
});

// CALL calculate average before remove
CourseSchema.pre("remove", function (next) {
	this.constructor.getAverage(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
