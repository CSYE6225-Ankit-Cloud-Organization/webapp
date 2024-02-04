const express = require('express');
const userController = require('../controllers/user-controller');
const userRouter = express.Router();

userRouter.get('/self',userController.getUser);
userRouter.put('/self',userController.updateUser);
userRouter.post('',userController.createUser);

module.exports = userRouter;