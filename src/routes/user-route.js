const express = require('express');
const userController = require('../controllers/user-controller');
const validations = require('../validators/validator');
const userRouter = express.Router();

userRouter.head('/self', (req, res) => {
    res.status(405).send();
});
userRouter.get('/self', validations.checkEmptyPayload, validations.checkContentType, validations.checkAuthorizationFields, validations.checkDbhealth, userController.getUser);
userRouter.put('/self', validations.checkContentType, validations.checkAuthorizationFields, validations.checkDbhealth, userController.updateUser);
userRouter.post('', validations.checkContentType, userController.createUser);


//explicitly handle all other api call options
userRouter.all('*', (req, res) => {
    if (req.method === 'HEAD' || req.method === 'OPTIONS') {
        res.status(405).send();
    }
    else {
        res.status(405).send();
    }
});
module.exports = userRouter;