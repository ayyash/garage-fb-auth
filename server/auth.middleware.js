// an example expressjs middleware to retrieve uid of every API call
// this is an example of API server, not client app backend server.

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
          // save in res locals
          res.locals.user = decodedToken;
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
