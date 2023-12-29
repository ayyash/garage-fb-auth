// to use this, npm install firebase-admin
// docs: https://firebase.google.com/docs/admin/setup
const admin = require('firebase-admin');
// this json is generated from Firebase Console project settings
const serviceAccount = require('../../abajor.json');

// initialize firebase
exports.sdk = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
