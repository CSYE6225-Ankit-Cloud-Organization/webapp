const express = require('express');
const healthController = require('../controllers/dbHealth-controller');
const dbHealthRouter = express.Router();

// defining the routes for our application

// This route will hanlde all requests made to /healthz
dbHealthRouter.all('', healthController);
// router.all('/authentication',authController);

module.exports = dbHealthRouter;