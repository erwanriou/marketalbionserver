const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// IMPORT ROUTES & JOBS
require("./jobs");
const routes = require("./routes");

// LAUNCH EXPRESS
const app = express();

// USE MAIN MIDDLEWWARE
app.set("trust proxy", true);
app.disable("x-powered-by");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());

// USE JOBS
routes.map((route) => app.use("/", route));

module.exports = app;
