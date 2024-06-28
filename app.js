"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary modules
// import express  from 'express';
var express = require("express");
var bodyParser = require("body-parser");
var parameterController_1 = require("./parameterController");
// Initialize Express app
var app = express();
var port = 3000;
// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Routes setup
app.use('/api', parameterController_1.default); // Example: using parameterController for '/api' route
// Start the server
app.listen(port, function () {
    console.log("Server running at http://localhost:".concat(port));
});
