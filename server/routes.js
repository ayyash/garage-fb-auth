// example routes file for getting account information after firebase validation
const express = require('express');

module.exports = function (sdk) {
  var router = express.Router();

  router.get('/account', function (req, res) {
    // get auth from req locals
    const user = res.locals.user;
    if (user) {
      res.json({
        data: user,
      });
    } else {
      res.status(401).json({
        message: 'Invalid token',
      });
    }
  });

  // a route to update user props, mainly bloodType
  router.post('/user', function (req, res) {
    // update local user with custom claims
    const user = res.locals.user;
    // read body params, could be an object
    const bloodType = req.body.bloodType;
    // set admin to true, set a new property bloodType
    // you can also use getAuth() from firebase-admin/auth directly
    // getAuth().setCustomClaims...
    sdk
      .auth()
      .setCustomUserClaims(user.uid, { admin: true, bloodType })
      .then(() => {
        // reassign res user
        res.locals.user = {
          ...user,
          admin: true,
          bloodType,
        };
        // return user
        res.json({
          data: res.locals.user,
        });
      })
      .catch(function (error) {
        res.status(401).json({
          message: 'Invalid token',
        });
      });
  });

  // export and use this router in the main server
  return router;
};
