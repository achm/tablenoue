import firebase from '~/plugins/firebase.js'

export default (context) => {
  firebase.auth().onIdTokenChanged(async (user) => {
    if (user) {
      const token = await user.getIdToken()
      document.cookie = `__session=${token};max-age=${(token ? 3600 : 0)};`

    } else {
      document.cookie = '__session=;max-age=0;'
    }
  })
}
