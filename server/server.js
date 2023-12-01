const express = require('express');

const webapi = express();

const sdk = require('./firebase.sdk').sdk;

const verify = require('./auth.middleware')(sdk);
webapi.use(verify);

// add routes, pass sdk only if needed
// webapi.use('/api', require('./api/account')(sdk));
// webapi.use('/api', require('./api/users')(sdk));
webapi.use('/api', require('./api/routes')());

// then listen
// webapi.listen()
