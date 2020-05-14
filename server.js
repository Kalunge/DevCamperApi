const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// load env file
dotenv.config({ path: "./config/config.env" });

// routes
const bootcamps = require("./router/bootcamps");
const courses = require("./router/courses");
const auth = require("./router/auth");
const users = require("./router/users");
const reviews = require("./router/reviews");

// Connect to db
connectDB();

const app = express();

// body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// File upload
app.use(fileUpload());

app.use(express.static(path.join(__dirname, "public")));

// mount router
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);

PORT = process.env.PORT;

const server = app.listen(
	PORT,
	console.log(
		`Server Running on poort ${PORT}, in ${process.env.NODE_ENV}`.yellow.bold
	)
);

process.on("unhandledRejection", (err, Promise) => {
	console.log(`Error: ${err.message}`.red);
	server.close(() => process.exit(1));
});
