// authenticateToken.js
//using the Firebase Admin SDK for Node.js to verify the authenticity 
//of a JSON Web Token (JWT) sent from the frontend
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/mevncrud',
});
async function decodeIDToken(req, res, next) {
  const header = req.headers?.authorization;
  if (header && header.startsWith('Bearer ')) {
    const idToken = header.split('Bearer ')[1];
try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req['currentUser'] = decodedToken;
    } catch (err) {
      console.log(err);
      console.log("no token found");
    }
  }
next();
}
module.exports = decodeIDToken;