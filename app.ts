// Import necessary modules
// import express  from 'express';
import express = require('express');

import * as bodyParser from 'body-parser';
import parameterController from './parameterController';

// Initialize Express app
const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes setup
app.use('/api', parameterController); // Example: using parameterController for '/api' route

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
