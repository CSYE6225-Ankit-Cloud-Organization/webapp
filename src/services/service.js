const express = require('express');
const sequelize = require('../config/dbConnection');

//this service will try to send a dummy query to database for server authentication
const dbHealthCheck = async () => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { dbHealthCheck };