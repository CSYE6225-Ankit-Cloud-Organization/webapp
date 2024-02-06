const express = require('express');
const userController = require('../controllers/user-controller');
const validations = require('../validators/validator');
const userRouter = express.Router();

userRouter.get('/self', validations.checkDbhealth, validations.checkEmptyPayload, userController.getUser);
userRouter.put('/self', validations.checkDbhealth, validations.checkContentType, userController.updateUser);
userRouter.post('', validations.checkContentType, validations.checkDbhealth, userController.createUser);
userRouter.all('*', (req, res) => {
    if (req.method === 'HEAD' || req.method === 'OPTIONS') {
        res.status(404).send();
    }
    else {
        res.status(404).send();
    }
});
module.exports = userRouter;