const express = require('express');
const sequelize = require('../config/dbConnection');
const { dbHealthCheck } = require('../services/service');

const healthController = async (req, res) => {
    try {
        //check if the request method is GET
        if (req.method !== 'GET') {
            console.log(`${req.method} is not allowed! Only GET is Allowed`);
            return res.status(405).send();
        }
        //check if the request payload is empty or not
        if (Object.keys(req.body).length > 0) {
            console.log(Object.keys(req.body).length);
            console.log(`Request Payload should be Empty!`);
            return res.status(400).send();
        }
        //check if the user tries to be smart and sends query parameters or not
        if (req.method === 'GET' && Object.keys(req.query).length > 0) {
            console.log(`Query Parameters not Allowed`);
            return res.status(400).send();
        }
        //check if the user choose other than JSON content type for the request payload
        if (req.get('Content-Type') !== undefined && req.get('Content-Type') !== 'application/json') {
            console.log(`only json allowed`);
            return res.status(400).send();
        }

        var dbStatus = await dbHealthCheck();
        // check if the database is up and running
        if (dbStatus == true) {
            console.log('######### Connection successful #########');
            return res.status(200).send();
        }
        else {
            console.error('######### Connection Unsuccessful #########', error);
            return res.status(503).send();
        }
    } catch (error) {
        console.error('######### Connection Unsuccessful #########', error);
        return res.status(503).end();
    }
};

module.exports = healthController;