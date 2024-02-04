const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/dbConnection');
const { dbHealthCheck } = require('../services/service');
const validator = require('../validators/validator');
const User = require('../models/User');

const saltRounds = 10;
const userController = {};

// To create a new user 
userController.createUser = async (req, res) => {

    try {
        //--------repeated code
        const { first_name, last_name, password, username } = req.body;
        // Define the expected fields
        const requiredFields = ['first_name', 'last_name', 'password', 'username'];
        const validationResult = validator.checkRequiredFields(req.body, requiredFields);
        const missingFields = validationResult?.missingFields || [];
        // const extraFields = validationResult?.extraFields || [];
        const extraFields = validationResult?.extraFields || [];

        // check if the json payload is valid
        if (missingFields.length > 0 || extraFields.length > 0) {
            console.log('Invalid Fields');
            return res.status(400).send();
        }

        // check if the email format is correct or not
        if (typeof username !== 'string' || !username.trim()) {
            console.log('Invalid username format');
            return res.status(400).send();
        }
        // check for other fields format
        if (typeof first_name !== 'string' || !first_name.trim() ||
            typeof last_name !== 'string' || !last_name.trim() ||
            typeof password !== 'string' || !password.trim()) {
            console.log('Invalid required fields');
            return res.status(400).send();
        }
        //--------repeated code -- service
        // check if email already exits in the db or not
        const findUser = await User.findOne({
            where: {
                username: {
                    [Op.iLike]: username // Case-insensitive search
                }
            }
        });
        if (findUser) {
            console.log(`username exists already`);
            return res.status(400).send();
        }
        else {
            // hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            //create the new user and add to the database
            const newUser = await User.create(
                {
                    first_name: first_name,
                    last_name: last_name,
                    password: hashedPassword,
                    username: username,
                    account_created: new Date().toISOString(),
                    account_updated: new Date().toISOString(),
                });

            //send the 201 status code and response without the password
            const responsePayload = {
                id: newUser.id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                username: newUser.username,
                account_created: newUser.account_created,
                account_updated: newUser.account_updated
            };
            console.log('user created successfully!!');
            return res.status(201).json(responsePayload);
        }
    }catch (error) {
        console.error('Error creating user:', error.message);
        return res.status(500).send();
    }
};

//to fetch authenticated user details
userController.getUser = async (req, res) => {
    try {
        //check if the user tries to be smart and sends query parameters or not
        if (Object.keys(req.query).length > 0) {
            console.log(`Query Parameters not Allowed`);
            return res.status(400).send();
        }
        // check if the auth method is basic
        // check if the auth field is not empty
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic') === -1) {
            return res.status(401).send();
        }
        // check if the user exits in db - 
        //decode token and
        const base64Cred = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Cred, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        //compare against db
        const user = await User.findOne({ where: { username: email } });
        console.log(user);
        if (!user) {
            return res.status(401).send();
        }
        //check password
        const isPasswordMatch = bcrypt.compareSync(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).send();
        }
        // fetch the details and return as json
        const responsePayload = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            account_created: user.account_created,
            account_updated: user.account_updated
        };
        return res.status(200).json(responsePayload);
    } catch (error) {
        console.error('Error getting user:', error.message);
        return res.status(500).send();
    }
};
//to update the user details
userController.updateUser = async (req, res) => {
    try {
        //check if the user tries to be smart and sends query parameters or not
        if (Object.keys(req.query).length > 0) {
            console.log(`Query Parameters not Allowed`);
            return res.status(400).send();
        }
        // check if the auth method is basic
        // check if the auth field is not empty
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic') === -1) {
            return res.status(401).send();
        }
        // check if the user exits in db - 
        //decode token and
        const base64Cred = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Cred, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        //compare against db and check if user exits
        const user = await User.findOne({ where: { username: email } });
        console.log(user);
        if (!user) {
            return res.status(401).send();
        }
        //check password
        const isPasswordMatch = bcrypt.compareSync(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).send();
        }
        // check for extra fields
        const { first_name, last_name, json_password, username } = req.body;
        const requiredFields = ['first_name', 'last_name', 'password'];
        const validationResult = validator.checkRequiredFields(req.body, requiredFields);
        const missingFields = validationResult?.missingFields || [];
        const extraFields = validationResult?.extraFields || [];

        // check if the json payload is valid
        if (extraFields.length > 0 || missingFields.length == 3) {
            console.log('Invalid Fields');
            return res.status(400).send();
        }
        // verify if user is trying to access his own account
        if (username !== email) {
            return res.status(403).send();
        }
        //hash the password again
        const hashedPassword = await bcrypt.hash(json_password, saltRounds);
        // update firstname, lastname, password and account_updated 
        user.first_name = first_name;
        user.last_name = last_name;
        user.password = hashedPassword;
        user.account_updated =new Date().toISOString(); 

        await user.save();
        return res.status(204).send();
    } catch (error) {
        console.error('Error updating user:', error.message);
        return res.status(500).send();
    }
};
//jshs
module.exports = userController;