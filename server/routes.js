// example routes file for getting account information after firebase validation
const express = require('express');

module.exports = function (sdk) {
  var router = express.Router();

  router.get('/auth/login', function (req, res) {
    // get auth from req locals
    const user = res.locals.user;
    if (user) {
      res.json({
        data: user,
      });
    } else {
      res.status(401).json({
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
  });

  // a route to update user props, mainly bloodType
  router.post('/user', function (req, res) {
    const user = res.locals.user;
    if (!user) {
      res.status(401).json({
        message: 'Access denied',
        code: 'ACCESS_DENIED',
      });
      return;
    }

    const bloodType = req.body.bloodType;

    sdk.auth().setCustomUserClaims(user.uid, { admin: true, bloodType }).then(() => {

      res.json({
        data: res.locals.user
      });
    }).catch(function (error) {
      res.status(401).json({
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    });
  });

  // export and use this router in the main server
  return router;
};
