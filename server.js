//Includes all server side code for the web application...
const app = require('./src/app');
const PORT = process.env.APP_PORT || 3000; // picking the port details from env file or default to 3000
const winston = require('winston');
const logger = require('./logger.js');
const sequelize = require('./src/config/dbConnection');
const User = require('./src/models/User'); // Import the User model
const Email = require('./src/models/Verifyemail.js'); // Import the Verifyemail model

// Testing all error types for Google Ops Agent
logger.debug('testing debug message');
logger.info('testing info message');
logger.warn('testing warn message');
logger.error('testing error message');

sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced successfully');
})

    .catch((error) => {
        logger.error('Error syncing database',error);
        console.error('Error syncing database');
    });

app.listen(PORT, () => {
    logger.info(`App started on port: ${PORT}`);
    console.log(`listening on port ${PORT}`);
});
