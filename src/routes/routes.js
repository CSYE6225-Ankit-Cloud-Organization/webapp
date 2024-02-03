const dbHealthRouter = require('./dbhealth-route');
const userRouter = require('./user-route'); 

const route = (app) => {
    app.use('/healthz', dbHealthRouter);
    app.use('/v1/user', userRouter);

    app.all('*', (req, res) => {
        res.status(404).json();
    });
}

module.exports = route;