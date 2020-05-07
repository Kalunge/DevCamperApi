const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require('colors')
const errorHandler = require('./middleware/error')
const connectDB = require("./config/db");

// load env file
dotenv.config({ path: "./config/config.env" });

// routes
const bootcamps = require("./router/bootcamps");
const courses = require("./router/courses");

// Connect to db
connectDB();

const app = express();

// body parser
app.use(express.json())

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// mount router
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

app.use(errorHandler)

PORT = process.env.PORT;

const server = app.listen(
	PORT,
	console.log(`Server Running on poort ${PORT}, in ${process.env.NODE_ENV}`.yellow.bold)
);

process.on("unhandledRejection", (err, Promise) => {
	console.log(`Error: ${err.message}`.red);
	server.close(() => process.exit(1));
});
