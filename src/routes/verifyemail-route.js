const express = require('express');
const emailVerifyController = require('../controllers/emailVerify-controller');
const verifyEmailRouter = express.Router();

// This route will handle all requests made to /healthz
verifyEmailRouter.all('', emailVerifyController);

module.exports = verifyEmailRouter;