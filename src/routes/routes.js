const express = require('express');
const healthController = require('../controllers/controller');
const checkUrl = require('../validators/validator');
const router = express.Router();

// defining the routes for our application

// This route will hanlde all requests made to /healthz
router.all('/healthz', healthController);
// router.all('/authentication',authController);

module.exports = router;