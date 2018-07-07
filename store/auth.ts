import firebase from '~/plugins/firebase'
import { debug } from 'util';

const googleProvider = new firebase.auth.GoogleAuthProvider()

export const state = () => ({
  user: null,
})

export const getters = {
  isAuthenticated(state) {
    return !!state.user
  }
}

export const mutations = {
  setUser(state, payload) {
    state.user = payload
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { app }) {
  },
  login() {
    return new Promise((resolve, reject) => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      firebase.auth().signInWithRedirect(googleProvider)
        .then(() => resolve())
        .catch((err) => reject(err))
    })
  },
  logout() {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut()
        .then(() => {
          this.commit("auth/setUser", null)
          resolve()
        })
        .catch((err) => reject(err))
    })
  },
  setUser({ commit }, payload) {
    commit("setUser", payload)
  }
}
