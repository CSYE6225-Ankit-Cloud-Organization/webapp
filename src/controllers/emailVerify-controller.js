const express = require('express');
const sequelize = require('../config/dbConnection.js');
const winston = require('winston');
const logger = require('../../logger.js');
const { User } = require('../models/User.js'); 
const { Email } = require('../models/Verifyemail.js');
const dbServices = require('../services/service.js');

const verifyUser = async (req, res) => {
    try {
        const { email, token } = req.query;
        console.log(email, token);
        console.log('Verifying the user');
        // check if the email format is correct or not
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof email !== 'string' || !email.trim() || !emailRegex.test(email.trim())) {
            console.log('Userid is not valid');
            return res.status(400).send('Bad Request');
        }

        if (!token.trim()) {
            console.log('Token missing');
            return res.status(400).send('Token Missing');
        }

        const result = await dbServices.findRecordByUsernameAndToken(email, token);
        console.log(result);

        if (!result) {
            return res.status(400).send('Invalid Link');
        }

        if (result.token === token && result.username === email) {
            const currentTime = new Date();
            const expiryTime = result.link_expiry_at;
            // const timeDifferenceInMillis = currentTime - linkCreatedAt;
            // const timeDifferenceInMinutes = timeDifferenceInMillis / (1000 * 60);
            if (currentTime <= expiryTime) {

                if (result.link_verified === false) {
                    result.link_verified = true;
                    await result.save();
                    console.log('verification done');
                    return res.status(200).json({ message: 'User Verification Completed' });
                } else {
                    return res.status(201).json({ message: 'User already verified.' });
                }
            } else {
                return res.status(400).json({ message: 'Token expired.' });
            }
        } else {
            return res.status(400).json({ message: 'Token and email do not match.' });
        }
    } catch (error) {
        console.error('Bad Request:', error);
        return res.status(400).json({ message: 'Bad Request' });
    }
};

module.exports = verifyUser;