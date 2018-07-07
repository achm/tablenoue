import firebase from '~/plugins/firebase'
const firestore = firebase.firestore();
firestore.settings({
  timestampsInSnapshots: true,
})
export default firestore