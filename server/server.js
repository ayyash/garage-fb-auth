const express = require('express');

const webapi = express();
webapi.use(express.json());
webapi.use(express.urlencoded({ extended: false }));

webapi.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // fix
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Content-Length, Accept, Authorization, Accept-Language");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT,PATCH, DELETE, OPTIONS");
    res.header("Cache-Control", "no-cache");
    next();
});

// preflight for cors 
webapi.options("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Content-Length, X-Requested-With, Accept, Accept-Language');
    res.sendStatus(200);
});


const sdk = require('./firebase.sdk').sdk;

const verify = require('./auth.middleware')(sdk);
webapi.use(verify);

// add routes, pass sdk only if needed
// webapi.use('/api', require('./api/account')(sdk));
// webapi.use('/api', require('./api/users')(sdk));
webapi.use('/api', require('./routes')(sdk));

webapi.use('/data', express.static(__dirname + '/data'));

webapi.use('/api/*', function (req, res, next) {
    // throw 404   
    res.status(404);
    const err = new Error('404');
    err['status'] = 404;
    next(err);
});

webapi.use(function (err, req, res, next) {

    console.log(err.stack);
    res.status(err.status || 500).json({
        message: err.message,
        code: err.code || 'UNKNOWN'
    });
});
const port = process.env.PORT || 10000;

webapi.listen(port, function (err) {
    console.log('listning to ' + port);

    if (err) {
        console.log(err);
        return;
    }
});


