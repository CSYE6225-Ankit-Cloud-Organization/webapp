const express = require('express');
const services = require('../services/service');
const validations = {};

//check if the user tries to be smart and sends query parameters or not
validations.checkQueryParameters = (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    console.log(`Query Parameters not Allowed`);
    return res.status(400).send();
  }
  next();
};

//to check if the url is only healthz or not
validations.checkUrl = (req, res, next) => {
  const allowedEndpoint = '/healthz';
  if (req.method === 'GET' && req.path !== allowedEndpoint) {
    console.log("healthz is allowed only");
    return res.status(404).send();
  }
  next();
};

// to check missing and excess fields as per the required fields in request payload

validations.checkRequiredFields = (dataObject, expectedFields) => {
  const providedFields = Object.keys(dataObject);
  const missingFields = expectedFields.filter(
    (field) => !providedFields.includes(field)
  );
  const excessFields = providedFields.filter(
    (field) => !expectedFields.includes(field)
  );
  return {
    missingFields, excessFields
  };
};

// to validate the requesy body content type
validations.checkContentType = (req, res, next) => {
  //check if the user choose other than JSON content type for the request payload
  if (req.get('Content-Type') !== undefined && req.get('Content-Type') !== 'application/json') {
    console.log(`only json allowed`);
    return res.status(400).send();
  }
  next();
};

// to check the health of the database
validations.checkDbhealth = async (req, res, next) => {
  try {
    const isDbHealthy = await services.dbHealthCheck();

    if (!isDbHealthy) {
      console.error('Error checking database health:');
      return res.status(503).send();
    }
  }
  catch (error) {
    console.error('Error checking database health:', error);
    res.status(503).send();
  }
  next();
};

// to check if the request body is empty or not
validations.checkEmptyPayload = (req, res, next) => {
  //check if the request payload is empty or not
  if (Object.keys(req.body).length > 0) {
    console.log(Object.keys(req.body).length);
    console.log(`Request Payload should be Empty!`);
    return res.status(400).send();
  }
  next();
};

module.exports = validations;