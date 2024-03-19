const express = require('express');
const bcrypt = require('bcrypt');
const sequelize = require('../config/dbConnection');
const { dbHealthCheck } = require('../services/service');
const validator = require('../validators/validator');
const User = require('../models/User');
const dbServices = require('../services/service');
const saltRounds = 10;
const userController = {};
const winston = require('winston');
const logger = require('../../logger.js');

// To create a new user 
userController.createUser = async (req, res) => {

    try {
        const { first_name, last_name, password, username } = req.body;
        // Define the expected fields
        const acceptableFields = ['first_name', 'last_name', 'password', 'username', 'account_created', 'account_updated'];
        const validationResult = validator.checkRequiredFields(req.body, acceptableFields);
        const missingField = validationResult?.missingFields || [];
        const excessFields = validationResult?.excessFields || [];
        const missingFields = missingField.filter(missingField => !['account_created', 'account_updated'].includes(missingField))

        // check if the json payload is valid
        if (missingFields.length > 0 || excessFields.length > 0) {
            // console.log('Required fields are missing or more fields..');
            return res.status(400).send('required fields missing or excess fields provided');
        }

        // check if the email format is correct or not
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof username !== 'string' || !username.trim() || !emailRegex.test(username.trim())) {
            // console.log('Invalid username format');
            return res.status(400).send('Invalid username');
        }
        // check for other fields format
        if (typeof first_name !== 'string' || !first_name.trim() ||
            !/^[a-zA-Z]+$/.test(first_name) || !/^[a-zA-Z]+$/.test(last_name) ||
            typeof last_name !== 'string' || !last_name.trim() ||
            typeof password !== 'string' || !password.trim()) {
            console.log('Invalid required fields');
            return res.status(400).send('Invalid fields');
        }

        try {
            const isDbHealthy = await dbServices.dbHealthCheck();

            if (!isDbHealthy) {
                console.error('Error checking database health:');
                return res.status(503).send();
            }
        }
        catch (error) {
            console.error('Error checking database health:', error);
            res.status(503).send();
        }

        const findUser = await dbServices.findUserByUsername(username);

        // check if email already exits in the db or not
        if (findUser) {
            console.log(`username exists already`);
            logger.error('Attempt to create duplicate user');
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
                    account_updated: new Date().toISOString()
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
            logger.info("User creation Successfull");
            console.log('user created successfully!!');
            return res.status(201).send(responsePayload);
        }
    } catch (error) {
        logger.error('Error creating user', error);
        console.error('Error creating user:', error.message);
        return res.status(500).send('Server side issues');
    }
};

//to fetch authenticated user details
userController.getUser = async (req, res) => {
    try {
        //check if the request payload is empty or not

        // check if the auth method is basic
        // check if the auth field is not empty
        // check if the user exits in db - 
        //decode token 
        const base64Cred = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Cred, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        // check if both email and password exist
        if (!email || !password) {
            return res.status(401).send('Authorization failed');
        }

        //compare username against db
        const user = await dbServices.findUserByUsername(email);
        console.log(user);

        if (!user) {
            return res.status(401).send('Authorization failed');
        }
        //check password against db
        const isPasswordMatch = bcrypt.compareSync(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).send('Authorization failed');
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
// to update the user details
userController.updateUser = async (req, res) => {
    try {
        // check if the auth method is basic
        // check if the auth field is not empty

        // check if the user exits in db - 
        //decode token and
        const base64Cred = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Cred, 'base64').toString('ascii');
        const [email, auth_password] = credentials.split(':');

        // check if both email and password exist
        if (!email || !auth_password) {
            return res.status(401).send('Authorization failed');
        }

        //compare against db and check if user exits
        const user = await dbServices.findUserByUsername(email);
        console.log(user);

        if (!user) {
            return res.status(401).send('Authorization failed');
        }
        //check password
        const isPasswordMatch = bcrypt.compareSync(auth_password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).send('Authorization failed');
        }
        // check for extra fields
        const { first_name, last_name, password } = req.body;
        const requiredFields = ['first_name', 'last_name', 'password'];
        const validationResult = validator.checkRequiredFields(req.body, requiredFields);
        const missingFields = validationResult?.missingFields || [];
        const extraFields = validationResult?.excessFields || [];

        // Check if the json payload is valid
        if (extraFields.length > 0 || (missingFields.length === 3 && !first_name && !last_name && !password)) {
            return res.status(400).send('Required fields missing or excess fields provided');
        }

        // Check for invalid field format
        if ((first_name && (!/^[a-zA-Z]+$/.test(first_name) || typeof first_name !== 'string')) ||
            (last_name && (!/^[a-zA-Z]+$/.test(last_name) || typeof last_name !== 'string')) ||
            (password && typeof password !== 'string')) {
            return res.status(400).send('Invalid fields');
        }

        // Update only the provided fields
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            user.password = hashedPassword;
        }

        user.account_updated = new Date().toISOString();

        await user.save();
        return res.status(204).send();
    } catch (error) {
        console.error('Error updating user:', error.message);
        return res.status(500).send();
    }
};
module.exports = userController;