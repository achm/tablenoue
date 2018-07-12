import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()
const messaging = admin.messaging()

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!")
})

exports.copyUserToFirestore = functions.auth.user().onCreate(user => {
    return db.collection("users").doc(user.uid).set({
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
    })
})

exports.removeUserFromFirestore = functions.auth.user().onDelete(user => {
    return db.collection("users").doc(user.uid).delete()
})

exports.subscribeCircle = functions.https.onCall(async ({ circleId, token }, context) => {
    const circleSnapshot = await db.collection('circles').doc(circleId).get()

    if (context.auth && circleSnapshot.exists) {
        await db.collection('circleSubscribers').doc(`${circleId}_${context.auth.uid}`).set({
            circleId: circleId,
            userId: context.auth.uid,
        })
        const circleSubscribersSnapshot = await db.collection('circleSubscribers').where('circleId', '==', circleId).get()
        await circleSnapshot.ref.update({
            subscribersCount: circleSubscribersSnapshot.size
        })
        await messaging.subscribeToTopic(token, `circles-${circleId}`)
    }

    return { result: true }
})

exports.unsubscribeCircle = functions.https.onCall(async ({ circleId, token }, context) => {
    const circleSnapshot = await db.collection('circles').doc(circleId).get()

    if (context.auth && circleSnapshot.exists) {
        await db.collection('circleSubscribers').doc(`${circleId}_${context.auth.uid}`).delete()
        const circleSubscribersSnapshot = await db.collection('circleSubscribers').where('circleId', '==', circleId).get()
        await circleSnapshot.ref.update({
            subscribersCount: circleSubscribersSnapshot.size
        })
        await messaging.unsubscribeFromTopic(token, `circles-${circleId}`)
    }

    return { result: true }
})

exports.notifyToCircle = functions.https.onCall(async ({ circleId, datetime }, context) => {
    const circleSnapshot = await db.collection('circles').doc(circleId).get()

    if (context.auth && circleSnapshot.exists) {
        const userSnapshot = await db.collection('users').doc(context.auth.uid).get()
        const circle = circleSnapshot.data()
        const user = userSnapshot.data()
        const circleSubscriberSnapshot = await db.collection('circleSubscribers').doc(`${circleId}_${context.auth.uid}`).get()
        if (circleSubscriberSnapshot.exists && circle && user) {
            const date = new Date(datetime)
            await circleSnapshot.ref.collection('kiuns').doc(`${user.uid}_${date.getTime()}`).set({
                user,
                datetime: date,
                createdAt: new Date()
            })
            const message: admin.messaging.Message = {
                topic: `circles-${circleId}`,
                data: {
                    circleId: circleId,
                    circleName: circle.name,
                    userId: context.auth.uid,
                    userName: user.displayName,
                    datetime: datetime,
                    type: 'KIUN_TO_CIRCLE'
                },
                notification: {
                    title: `「${circle.name}」でボドゲの機運！`,
                    body: `${user.displayName}さんが${circle.name}で機運を発しました`,
                },
            }
            await messaging.send(message)
        }
    }

    return { result: true }
})