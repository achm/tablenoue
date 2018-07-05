import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
import express from 'express';
import { Nuxt } from 'nuxt';

const app = express();
const nuxt = new Nuxt({
    dev: false,
    buildDir: '../',
    build: {
        publicPath: '/assets/'
    }
});

function handleRequest(req, res) {
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    return new Promise((resolve, reject) => {
        nuxt.render(req, res, (promise) => {
            promise.then(resolve).catch(reject);
        });
    });
}

app.use(handleRequest);
exports.nuxt = functions.https.onRequest(app);