const dbHealthRouter = require('./dbhealth-route');
const userRouter = require('./user-route'); 

const route = (app) => {
    app.use('/healthz', dbHealthRouter);
    app.use('/v1/user', userRouter);
    // app.get('/hello', (req, res) => {
    //     res.json({ message: 'Hello, World!' });
    //   });
    app.all('*', (req, res) => {
        res.status(404).send();
    });
}

module.exports = route;