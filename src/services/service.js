const express = require('express');
const sequelize = require('../config/dbConnection');
const User = require('../models/User');
const Email  = require('../models/Verifyemail');

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

dbServices.findRecordByUsernameAndToken = async (username, token) => {
  const emailRecord = await Email.findOne({
    where: {
      [Op.and]: [
        {
          username: {
            [Op.eq]: username // Exact match for username
          }
        },
        {
          token: {
            [Op.eq]: token // Exact match for token
          }
        }
      ]
    }
  });

  return emailRecord;
};

dbServices.findEmailRecordByUsername = async (username) => {
  const emailRecord = await Email.findOne({
    where: {
      username: {
        [Op.iLike]: username // Case-insensitive search
      }
    }
  });

  return emailRecord;
};


module.exports = dbServices;