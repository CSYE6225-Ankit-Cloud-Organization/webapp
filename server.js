//Includes all server side code for the web application..
const app = require('./src/app');
const PORT = process.env.APP_PORT || 3000; // picking the port details from env file or default to 3000
// const sequelize = require('./src/config/dbConnection');
// const User = require('./src/models/User'); // Import the User model



// sequelize.sync({ force: true }).then(() => {
//     console.log('Database synced successfully');
// })

//     .catch((error) => {
//         console.error('Error syncing database::', error);
//     });

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
