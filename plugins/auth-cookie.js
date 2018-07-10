import firebase from '~/plugins/firebase.js'

export default (context) => {
  firebase.auth().onIdTokenChanged((idToken) => {
    document.cookie = `__session=${idToken};max-age=${(idToken ? 3600 : 0)};`
  })
}