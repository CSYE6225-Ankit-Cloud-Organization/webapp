const express = require('express');
const userController = require('../controllers/user-controller');
const userRouter = express.Router();

userRouter.get('/self',);
userRouter.put('/self',);
userRouter.post('',userController.createUser);

module.exports = userRouter;