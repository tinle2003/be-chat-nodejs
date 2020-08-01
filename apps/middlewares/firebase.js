var admin = require("firebase-admin");

var serviceAccount = require("../core/serviceAccountKey.json");

let firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://freelancers-5b3eb.firebaseio.com"
});

module.exports = firebaseApp