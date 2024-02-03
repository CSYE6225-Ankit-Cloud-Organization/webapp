// Includes all the code related to the web application leaving the server side code

const express = require('express')
const app = express();
require('dotenv').config(); // required to read the .env file
const Routes = require('./routes/routes'); // loading module containg routes
const checkUrl = require('./validators/validator'); //loading module containing validators

app.use(express.json()); // middleware to parse the json from the request body

//middleware to set headers to the response
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});
app.use(checkUrl);
app.use('/',Routes); // using the routes

module.exports = app;
