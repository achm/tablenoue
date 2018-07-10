const admin = require('../serverMiddleware/firebase-admin.js')
const cookieParser = require('cookie-parser')();

module.exports = (req, res, next) => {
  getIdTokenFromRequest(req, res).then(idToken => {
    if (idToken) {
      addDecodedIdTokenToRequest(idToken, req).then(() => {
        next()
      })
    } else {
      next()
    }
  });
}

const getIdTokenFromRequest = (req, res) => {
  return new Promise((resolve) => {
    cookieParser(req, res, () => {
      if (req.cookies && req.cookies.__session) {
        resolve(req.cookies.__session)
      } else {
        resolve()
      }
    });
  });
}

/**
 * Returns a Promise with the Decoded ID Token and adds it to req.user.
 */
const addDecodedIdTokenToRequest = (idToken, req) => {
  return admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    req.user = {
      uid: decodedIdToken.uid,
      photoURL: decodedIdToken.picture,
      displayName: decodedIdToken.name,
    }
  })
}