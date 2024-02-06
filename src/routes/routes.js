const dbHealthRouter = require('./dbhealth-route');
const userRouter = require('./user-route'); 

const route = (app) => {
    app.use('/healthz', dbHealthRouter); // direct api calls to the health router
    app.use('/v1/user', userRouter); // direct api calls to the user router
    
    // explicitly handle any other calls besides healthz and user
    app.all('*', (req, res) => {
        res.status(404).send();
    });
}

module.exports = route;