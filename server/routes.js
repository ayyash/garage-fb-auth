// example routes file for getting account information after firebase validation
const express = require('express');
const profiles = require('./data/profiles.json');

module.exports = function (sdk) {
    var router = express.Router();

    
    router.post('/auth/login', function (req, res) {
        // if email does not exist create user, else update user
        const payload = req.body;
        const token = payload.token;

        // we need to first verify token
        sdk.auth().verifyIdToken(token).then(function (decodedToken) {
            // then find user by id 
            const id = decodedToken.uid;
            let profile = profiles.find((profile) => profile.id === id);
            const user = {
                id: decodedToken.uid,
                picture: decodedToken.picture,
                email: payload.email// use the payload email
                 
            };
            // if user does not exist, create one
            if (!profile) {
                
                // save new user to db then return
                // we don't have bloodType just yet
                const _newuser = {...user, admin: true, newUser: true};
                profiles.push(_newuser);
                console.log(_newuser);

                res.json(_newuser);
            } else {
                
                // return existin user with full profile
                console.log('existing user', profile);
                // could be newUser = true
                res.json({ ...profile, ...user});
            }
            

        }).catch(function (error) {
            res.status(401).json({
                message: 'Invalid token',
                code: 'INVALID_TOKEN',
            });
        });
    });

    router.patch('/user', function(req, res) {
        // user exists in middleware
        const user = res.locals.user;
        console.log('update', user);

        if (user) {
            // update user in db with body inforation
            const payload = req.body;
            
            // update db
            let profile = profiles.find((profile) => profile.id === user.id);
            profile.bloodType = payload.bloodType;
            profile.newUser = false;

            // save local
            res.locals.user = profile;

            // return user
            res.json(profile);
        } else {
            res.status(401).json({
                message: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }
    });

    router.get('/projects/list', function (req, res) {
        // get auth from req locals
        const user = res.locals.user;
        if (user) {
            res.json({something: 'something'});
        } else {
            res.status(401).json({
                message: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }
    });

    // export and use this router in the main server
    return router;
};
