// an example expressjs middleware to retrieve uid of every API call
// this is an example of API server, not client app backend server.

const profiles = require('./data/profiles.json');

module.exports = function (sdk) {
    return function (req, res, next) {
        // check header for token then verify, find user, return info
        let authheader = req.headers['authorization'];
        // if not move on with none
        if (authheader) {
            // call auth then veirfyIdToken
            authheader = authheader.substring('Bearer '.length);
            sdk
                .auth()
                .verifyIdToken(authheader)
                .then(function (decodedToken) {
                    // get user from db using uid
                    let profile = profiles.find((profile) => profile.id === decodedToken.uid);
                    console.log('found', profile);
                    if (profile) {
                        // exmaple: profile
                        // put it together and send back
                        // we might also read decodedToken.exp
                        res.locals.user = profile;

                    } else {
                        // no user found, ignore incoming
                        res.locals.user = null;
                    }

                    // next
                    next();
                })
                .catch(function (error) {
                    res.locals.user = null;
                    next();
                });
        } else {
            next();
        }
    };
};
