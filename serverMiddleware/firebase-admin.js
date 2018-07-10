const admin = require('firebase-admin');

module.exports = admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.SERVICE_ACCOUNT,
        privateKey: process.env.PRIVATE_KEY,
    }),
    databaseURL: process.env.DATABASE_URL
});