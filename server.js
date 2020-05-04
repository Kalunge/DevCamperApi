const express = require("express");
const dotenv = require("dotenv");
// const logger = require('./middleware/logger')
const morgan = require('morgan')

// routes
const bootcamps = require("./router/bootcamps");

// load env file
dotenv.config({ path: "./config/config.env" });

const app = express();

if (process.env.NODE_ENV === 'development'){
	app.use(morgan('dev'))
}

// mount router
app.use("/api/v1/bootcamps", bootcamps);


PORT = process.env.PORT;

app.listen(
	PORT,
	console.log(`Server Running on poort ${PORT}, in ${process.env.NODE_ENV}`)
);
