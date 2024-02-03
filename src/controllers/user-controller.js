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
        const { first_name, last_name, password, username } = req.body;
        // Define the expected fields
        const requiredFields = ['first_name', 'last_name', 'password', 'username'];
        const validationResult = validator.checkRequiredFields(req.body, requiredFields);
        const missingFields = validationResult?.missingFields || [];
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
    }
    catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).send();
    }
}
module.exports = userController;