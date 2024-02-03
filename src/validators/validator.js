const express = require('express');

//to check if the url is only healthz or not
const checkUrl = (req, res, next) => {
  const allowedEndpoint = '/healthz';
  if (req.method === 'GET' && req.path !== allowedEndpoint) {
    console.log("healthz is allowed only");
    return res.status(404).send();
  }
  next();
};

const checkAuthorization = (req,res,next) =>{
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).send();
      // return res.status(401).json({ message: 'Authorization header missing' });
  }

  // Decode the base64 authorization header
  const authData = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
  const [email, password] = authData.split(':');
  console.log(`${email} ${password}`);
  next();
}
// const checkJson = (req,res,next)=> {
//   const jsonString = JSON.stringify(req.body);
//   console.log("in check json");
//   try {
//       const jsonData = JSON.parse(req.body);
//       // If parsing is successful, jsonData contains the parsed JSON
//       res.status(200).json({ success: true, data: jsonData });
//     } catch (error) {
//       if (error instanceof SyntaxError) {
//         // Handle SyntaxError (Invalid JSON)
//         res.status(400).send();
//       } else {
//         // Handle other types of errors
//         res.status(500).send();
//       }
//     }
//     next();
// };

module.exports = checkUrl;