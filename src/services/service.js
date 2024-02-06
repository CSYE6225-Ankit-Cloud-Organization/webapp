const express = require('express');
const sequelize = require('../config/dbConnection');
const User = require('../models/User');
const { Op } = require('sequelize');

//this service will try to send a dummy query to database for server authentication
const dbServices = {}

dbServices.dbHealthCheck = async () => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
};

dbServices.findUserByUsername = async (username) => {
  const user = await User.findOne({
    where: {
      username: {
        [Op.iLike]: username // Case-insensitive search
      }
    }
  });

  return user;
};

module.exports = dbServices;