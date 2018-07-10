const admin = require('~/serverMiddleware/firebase-admin.js')
const cookieParser = require('cookie-parser')();

module.exports = (req, res, next) => {
  getIdTokenFromRequest(req, res).then(idToken => {
    if (idToken) {
      addDecodedIdTokenToRequest(idToken, req).then(() => {
      });
    } else {
      next();
    }
  });
}

const getIdTokenFromRequest = (req, res) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    return Promise.resolve(req.headers.authorization.split('Bearer ')[1]);
  }
  return new Promise((resolve) => {
    cookieParser(req, res, () => {
      if (req.cookies && req.cookies.__session) {
        console.log('Found "__session" cookie');
        // Read the ID Token from cookie.
        resolve(req.cookies.__session);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Returns a Promise with the Decoded ID Token and adds it to req.user.
 */
const addDecodedIdTokenToRequest = (idToken, req) => {
  return admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
  }).catch(error => {
    console.error('Error while verifying Firebase ID token:', error);
  });
}