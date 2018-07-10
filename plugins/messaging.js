import firebase from '~/plugins/firebase'
if (!process.server) {
  const messaging = firebase.messaging()
  messaging.onMessage((payload) => {
    console.log(payload)
    alert(payload.notification.body)
  });
}