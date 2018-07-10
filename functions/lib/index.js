"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});
exports.copyUserToFirestore = functions.auth.user().onCreate(user => {
    return db.collection("users").doc(user.uid).set({
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
    });
});
exports.removeUserFromFirestore = functions.auth.user().onDelete(user => {
    return db.collection("users").doc(user.uid).delete();
});
exports.subscribeCircle = functions.https.onCall(({ circleId, token }, context) => __awaiter(this, void 0, void 0, function* () {
    const circleSnapshot = yield db.collection('circles').doc(circleId).get();
    if (context.auth && circleSnapshot.exists) {
        yield db.collection('circleSubscribers').doc(`${circleId}_${context.auth.uid}`).set({
            circleId: circleId,
            userId: context.auth.uid,
        });
        const circleSubscribersSnapshot = yield db.collection('circleSubscribers').where('circleId', '==', circleId).get();
        yield circleSnapshot.ref.update({
            subscribersCount: circleSubscribersSnapshot.size
        });
        yield messaging.subscribeToTopic(token, `circles-${circleId}`);
    }
    return { result: true };
}));
exports.unsubscribeCircle = functions.https.onCall(({ circleId, token }, context) => __awaiter(this, void 0, void 0, function* () {
    const circleSnapshot = yield db.collection('circles').doc(circleId).get();
    if (context.auth && circleSnapshot.exists) {
        yield db.collection('circleSubscribers').doc(`${circleId}_${context.auth.uid}`).delete();
        const circleSubscribersSnapshot = yield db.collection('circleSubscribers').where('circleId', '==', circleId).get();
        yield circleSnapshot.ref.update({
            subscribersCount: circleSubscribersSnapshot.size
        });
        yield messaging.unsubscribeFromTopic(token, `circles-${circleId}`);
    }
    return { result: true };
}));
exports.notifyToCircle = functions.https.onCall(({ circleId }, context) => __awaiter(this, void 0, void 0, function* () {
    const circleSnapshot = yield db.collection('circles').doc(circleId).get();
    if (context.auth && circleSnapshot.exists) {
        const userSnapshot = yield db.collection('users').doc(context.auth.uid).get();
        const circle = circleSnapshot.data();
        const user = userSnapshot.data();
        const circleSubscriberSnapshot = yield db.collection('circleSubscribers').doc(`${circleId}_${context.auth.uid}`).get();
        if (circleSubscriberSnapshot.exists) {
            const message = {
                topic: `circles-${circleId}`,
                data: {
                    circleId: circleId,
                    circleName: circle.name,
                    userId: context.auth.uid,
                    userName: user.displayName,
                },
                notification: {
                    title: `「${circle.name}」でボドゲの機運！`,
                    body: `${user.displayName}さんが${circle.name}で機運を発しました`,
                },
            };
            yield messaging.send(message);
        }
    }
    return { result: true };
}));
//# sourceMappingURL=index.js.map