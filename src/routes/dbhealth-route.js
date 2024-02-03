const express = require('express');
const healthController = require('../controllers/dbHealth-controller');
const dbHealthRouter = express.Router();

// defining the routes for our application

// This route will handle all requests made to /healthz
dbHealthRouter.all('', healthController);


module.exports = dbHealthRouter;